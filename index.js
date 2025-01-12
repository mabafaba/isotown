// basic express server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const router = require('./server/router.js');

const port = 3000;
// serve /client folder on "/client"
const app = express();
app.use(express.static('client'));

// use json for request body
app.use(express.json({ limit: '50mb' }));
// new grid cell

app.use(router);

// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        // let all users know
        console.log('user disconnected');
        socket.broadcast.emit('user-disconnected', socket.id);
    });
    socket.on('new-cell-created', (data) => {
        console.log('new cell created:', data);
        // let all users except sender know
        socket.broadcast.emit('new-cell-created', data);

    });

    // active-cell-change
    socket.on('user-moved', (data) => {
        console.log('active cell change:', data);
        // let all users except sender know
        data.socketId = socket.id;
        socket.broadcast.emit('user-moved', data);

    });

    // 
});

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
