const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');
const cors = require('cors');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.html');
});

const messages = [];
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });

    socket.on('newUser', username => {
        io.emit("userJoined", username);
    });

    socket.emit('previousMessages', messages);
});

httpServer.listen(5000);
