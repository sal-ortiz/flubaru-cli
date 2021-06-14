#!/usr/bin/env node

const Args = require('command-line-args');
const PortAudio = require('naudiodon');
const UDP = require('udp-audio-stream');

//const defaultAddr = '0.0.0.0';
const defaultAddr = '224.0.0.120';
const defaultPort = 3000;

const exitCodeSuccess = 0;
const exitCodeFailure = 255;


const argsCfg = [
  { name: 'port',     alias: 'p', type: Number, defaultOption: defaultPort },
  { name: 'address',  alias: 'b', type: String, defaultOption: defaultAddr },
  { name: 'help',     alias: 'h', type: String },
]

const args = Args(argsCfg);


if (args.help) {
  let str = [
    'usage: ./client.js [TARGET_PORT] [TARGET_ADDRESS]',
    '   [TARGET_PORT defaults to port ' + defaultPort,
    '   [TARGET_ADDRSS] defaults to address ' + defaultAddr,
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


const client = new UDP.Client(inpEngine);

process.on('exit', client.disconnect.bind(client));   // cleanup

process.on('SIGINT', process.exit.bind(process));     // exit
process.on('SIGUSR1', process.exit.bind(process));    // exit
process.on('SIGUSR2', process.exit.bind(process));    // exit


let udpAddress = args.address;
let udpPort = args.port;

console.log(args)
//console.log(udpAddress, udpAddress.constructor)
//console.log(udpPort, udpPort.constructor)

client.connect(args.address, args.port);
