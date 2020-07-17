// AsebaHTTP3 via Javascript for Thymio Suite

var express = require('express');
var app = express();
var server = app.listen(3000);

var data = [0];

app.use(express.static('dist'));
app.get('/node', showJSON);
console.log("Thymio Suite server running at ws://127.0.0.1:3000");

var socket;
var io = require('socket.io').listen(server);
io.sockets.on('connection',newConnection);

function newConnection(_socket) {
    socket = _socket;
    console.log('new connection: ' + socket.id);
    socket.on('thymio', thymioMsg);
} 
function thymioMsg(_data) {
    data =_data;
    io.sockets.emit('thymio',data); 
    
}
function showJSON(req, res){
    res.send(data);
}