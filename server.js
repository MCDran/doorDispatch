// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('dispatch_ready', () => {
    io.emit('group_ready');  // Notify door side that group is ready
  });

  socket.on('group_sent', () => {
    io.emit('reset_screens');  // Reset both sides
  });

  // Chat function
  socket.on('chat_message', (msg) => {
    io.emit('receive_message', msg);  // Send message to both sides
  });

  // Emergency alert event
  socket.on('emergency_alert', () => {
    io.emit('emergency_alert');  // Alert dispatch about emergency
  });

  // Clear emergency event
  socket.on('clear_emergency', () => {
    io.emit('clear_emergency');  // Clear emergency on both sides
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
