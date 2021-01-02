const WebSocket = require('ws')
 const process = require('process'); 
 process.title = "RiftedWorld - Server 0.0.1";

 const express = require('./modules/express');

 express.startwebserver();
const wss = new WebSocket.Server({ port: 8080 })
 
wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  ws.send('Hello! Message From Server!!')
})