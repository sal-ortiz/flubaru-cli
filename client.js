#!/usr/bin/env node

const Args = require('command-line-args');
const PortAudio = require('naudiodon');
const TCP = require('tcp-audio-stream').Client;

const defaultAddr = '0.0.0.0';
const defaultPort = '3000';

const exitCodeSuccess = 0;
const exitCodeFailure = 255;


const argsCfg = [
  { name: 'address',  alias: 'b', type: String, defaultOption: defaultAddr },
  { name: 'port',     alias: 'p', type: String, defaultOption: defaultPort },
  { name: 'help',     alias: 'h', type: String, defaultOption: defaultPort },
]

const args = Args(argsCfg);


if (args.help) {
  let str = [
    'usage: ./client.js [TARGET_ADDRESS] [TARGET_PORT]',
    '   [TARGET_ADDRSS] defaults to address ' + defaultAddr,
    '   [TARGET_PORT defaults to port ' + defaultPort,
   '',
  ].join('\n');

  process.stdout.write(str);
  process.exit(exitCodeFailure);
}


const inpEngine = new PortAudio.AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: PortAudio.SampleFormat16Bit,
    sampleRate: 22000,
    deviceId: -1, // default device

    highWaterMark: 1024,
    framesPerBuffer: 16,
  },

});


const client = new TCP(inpEngine);

process.on('exit', client.disconnect.bind(client));   // cleanup

process.on('SIGINT', process.exit.bind(process));     // exit
process.on('SIGUSR1', process.exit.bind(process));    // exit
process.on('SIGUSR2', process.exit.bind(process));    // exit


let tcpAddress = args.address || defaultAddr;
let tcpPort = args.port || defaultPort;

client.connect(tcpAddress, tcpPort);

process.exit(exitCodeSuccess);
