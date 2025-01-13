// basic express server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const router = require('./server/router.js');
const db = require('./server/db.js');

const port = 3000;
// serve /client folder on "/client"
const app = express();
app.use("/isotown", express.static('client'));

// use json for request body
app.use(express.json({ limit: '50mb' }));
// new grid cell

app.use('/isotown', router);

// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });

const server = http.createServer(app);
const io = new Server(server, {
    path: '/isotown-socket-io', // Match the NGINX location block
  });

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

    socket.on('chat-message', (data) => {
        // data.message is a string with the message
        // data.i and data.j are integers with the cell coordinates
        data.socketId = socket.id;
        console.log('chat message:', data);

        // need to compose according to:
        // const chatMessageSchema = new mongoose.Schema({
        //     cell : { type: mongoose.Schema.Types.ObjectId, ref: 'GridCell' },
        //     timestamp: { type: Date, default: Date.now },
        //     message: String,
        //     messageType: { type: String, enum: ['text', 'voice'], required: true },
        //     user: String
        // });
        
        // find cell
        db.GridCell.findOne({ x: data.i, y: data.j })
            .then(cell => {
                if (!cell) {
                    console.log('cell not found:', data.i, data.j);
                    return;
                }
                // create chat message
                const chatMessage = new db.ChatMessage({
                    cell: cell._id,
                    message: data.message,
                    messageType: 'text',
                    user: data.socketId
                });
                return chatMessage.save();
            })
            .then(chatMessage => {
                if (chatMessage) {
                    console.log('chat message saved:', chatMessage);
                    // add chat message to cell
                    return db.GridCell.findOneAndUpdate(
                        { x: data.i, y: data.j },
                        { $push: { chatMessages: chatMessage._id } },
                        { new: true }
                    );
                }
            }).then(cell => {
                if (cell) {
                    console.log('chat message added to cell:', cell);
                    // populate and log
                    db.GridCell.findOne({ x: data.i, y: data.j }).populate('chatMessages')
                        .then(cell => {
                            console.log('cell with chat messages:', cell.chatMessages);
                        });
                    // let all users know
                    socket.broadcast.emit('chat-message', {
                        i: data.i,
                        j: data.j,
                        message: data.message,
                        user: data.socketId
                    });
                }
            })
            .catch(err => {
                console.log('error:', err);
            });

    // 
});

});

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
