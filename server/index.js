const express = require('express');
const http = require('http');
const router = require('./router');
const PORT = process.env.PORT || 5000;
const { addUser, getUser, removeUser, getUsersInRoom } = require('./users')
const app = express();
const server = http.createServer(app);
const socketio = require("socket.io");
const cors = require('cors');

// corsOptions={
//     cors: true,
//     origins:["http://localhost:3000"],
//    }
   const io = socketio(server);


app.use(router);
app.use(cors());

io.on('connect', (socket) => {
    console.log('connected')
    socket.on('join', ({name, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room }); 

        if(error) return callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text : `${user.name}, has joined!`});
    
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user:user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        callback();
    });

    socket.on('disconnect', ()=>{
        console.log('disconnected')
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    });
});



server.listen(PORT,() => console.log(`Server is listening to ${PORT}`))