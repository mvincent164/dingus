const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {}; // Store active players

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    // Create new player
    players[socket.id] = { x: 400, y: 300 };
    io.emit('updatePlayers', players);
    
    socket.on('playerMove', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
        }
        io.emit('updatePlayers', players);
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
