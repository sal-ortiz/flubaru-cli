#!/usr/bin/env node

const Args = require('command-line-args');
const PortAudio = require('naudiodon');
const TCP = require('tcp-audio-stream').Server;


const defaultAddr = '0.0.0.0';
const defaultPort = '3000';

const exitCodeSuccess = 0;
const exitCodeFailure = 255;


const argsCfg = [
  { name: 'address',  alias: 'b', type: String, defaultOption: defaultAddr },
  { name: 'port',     alias: 'p', type: String, defaultOption: defaultPort },
  { name: 'help',     alias: 'h', type: String },
]

const args = Args(argsCfg);


if (args.help) {
  let str = [
    'usage: ./server.js [BIND_ADDRESS] [BIND_PORT]',
    '   [BIND_ADDRSS] defaults to address ' + defaultAddr,
    '   [BIND_PORT defaults to port ' + defaultPort,
   '',
  ].join('\n');

  process.stdout.write(str);
  process.exit(exitCodeFailure);
}


const outpEngine = new PortAudio.AudioIO({
  outOptions: {
    channelCount: 2,
    sampleFormat: PortAudio.SampleFormat16Bit,
    sampleRate: 22000,
    deviceId: -1, // default device.
    closeOnError: false,

    highWaterMark: 1024,
    framesPerBuffer: 16,
  },

});


const server = new TCP(outpEngine);

process.on('exit', server.stop.bind(server));       // cleanup

process.on('SIGINT', process.exit.bind(process));   // exit
process.on('SIGUSR1', process.exit.bind(process));  // exit
process.on('SIGUSR2', process.exit.bind(process));  // exit


let tcpAddress = args.address || defaultAddr;
let tcpPort = args.port || defaultPort;

server.start(args.address, args.port);

process.exit(exitCodeSuccess);
