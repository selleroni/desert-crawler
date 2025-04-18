const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    socket.on('newPlayer', (data) => {
        players[socket.id] = data;
        io.emit('updatePlayers', players);
    });

    socket.on('update', (data) => {
        players[socket.id] = data;
        io.emit('updatePlayers', players);
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

http.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
});