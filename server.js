#!/usr/bin/env node

const Args = require('command-line-args');
const PortAudio = require('naudiodon');
const UDP = require('udp-audio-stream');

const defaultAddr = '0.0.0.0';
//const defaultAddr = '224.0.0.120';
const defaultPort = 3000;

const exitCodeSuccess = 0;
const exitCodeFailure = 255;


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


const server = new UDP.Server(outpEngine);

process.on('exit', server.stop.bind(server));       // cleanup

process.on('SIGINT', process.exit.bind(process));   // exit
process.on('SIGUSR1', process.exit.bind(process));  // exit
process.on('SIGUSR2', process.exit.bind(process));  // exit


let udpAddress = process.argv[2] || defaultAddr;
let udpPort = (process.argv[1] && parseInt(process.argv[1])) || defaultPort;


server.start(udpAddress, udpPort);
