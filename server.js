const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

// Correctly initialize socket.io after creating the server
const io = socketIO(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Application state
let state = {
    isGroupReady: false,
    isEmergencyActive: false,
    chatHistory: []
};

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit current state when a new user connects
    socket.emit('state_update', state);

    socket.on('request_status', () => {
        socket.broadcast.emit('request_status'); // Forward the request to other clients (the door)
    });

    socket.on('dispatch_ready', () => {
        state.isGroupReady = true;
        io.emit('group_ready');
        io.emit('state_update', { isGroupReady: true }); // Broadcast state change
    });

    socket.on('group_sent', () => {
        state.isGroupReady = false;
        io.emit('group_sent_confirmation');
        io.emit('reset_screens');
        io.emit('state_update', { isGroupReady: false });
    });

    // Chat function
    socket.on('chat_message', (msg) => {
        state.chatHistory.push(msg);
        io.emit('receive_message', msg);
        io.emit('state_update', { chatHistory: state.chatHistory }); // Broadcast state change
    });

    // Emergency alert event
    socket.on('emergency_alert', () => {
        state.isEmergencyActive = true;
        io.emit('emergency_alert_active');
        io.emit('state_update', { isEmergencyActive: true });
    });

    // Clear emergency event
    socket.on('clear_emergency', () => {
        state.isEmergencyActive = false;
        io.emit('emergency_alert_cleared');
        io.emit('state_update', { isEmergencyActive: false });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
