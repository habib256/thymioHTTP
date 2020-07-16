// AsebaHTTP3 via Javascript for Thymio Suite

var express = require('express');
var app = express();
var server = app.listen(3000);
app.use(express.static('dist'));
console.log("My Thymio socket server is running at ws://127.0.0.1:3000");

var socket;
var io = require('socket.io').listen(server);
io.sockets.on('connection',newConnection);

function newConnection(_socket) {
    socket = _socket;
    console.log('new connection: ' + socket.id);
    socket.on('thymio', thymioMsg);
} 
function thymioMsg(data) {
    io.sockets.emit('thymio',data); 
}