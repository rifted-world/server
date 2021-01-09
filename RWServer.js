"use strict";

const WebSocket = require('ws')
 const process = require('process'); 
//const IPFS = require('./modules/ipfs');
 const express = require('./modules/express');
 const pubsub = require('./modules/ipfs_pubsub_test');
const IPFS = require('./modules/ipfs');
const { strict } = require('assert');

IPFS.start();

setTimeout(function(){
pubsub.start();

},5000)

process.title = "RiftedWorld - Server 0.0.1";

 express.startwebserver();

const wss = new WebSocket.Server({ port: 446 })
 
wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`);
    ws.send( `Return  ${message}`)
  })
  ws.send('Hello! Message From Server!!');
  console.log("WS Ready")
})