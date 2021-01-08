"use strict";

const WebSocket = require('ws')
 const process = require('process'); 
//const IPFS = require('./modules/ipfs');
 const express = require('./modules/express');
const IPFS = require('./modules/ipfs');
const { strict } = require('assert');

//IPFS.start();

 process.title = "RiftedWorld - Server 0.0.1";

 express.startwebserver();

const wss = new WebSocket.Server({ port: 8080 })
 
wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  ws.send('Hello! Message From Server!!')
})