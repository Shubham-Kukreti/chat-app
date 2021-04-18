const express = require('express');
const http = require('http');
const router = require('./router');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const socketio = require("socket.io");

corsOptions={
    cors: true,
    origins:["http://localhost:3000"],
   }
   const io = socketio(server, corsOptions);


app.use(router);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', ()=>{
        console.log('user has left!!!')
    });
});

server.listen(PORT,() => console.log(`Server is listening to ${PORT}`))