#!/usr/bin/env node

const Args = require('command-line-args');
const PortAudio = require('naudiodon');
const UDP = require('udp-audio-stream');

const defaultAddr = '0.0.0.0';
//const defaultAddr = '224.0.0.120';
const defaultPort = 3000;

const exitCodeSuccess = 0;
const exitCodeFailure = 255;


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


let udpAddress = process.argv[2] || defaultAddr;
let udpPort = (process.argv[1] && parseInt(process.argv[1])) || defaultPort;


client.connect(udpAddress, udpPort);
