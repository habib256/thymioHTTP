// AsebaHTTP3 via Javascript for Thymio Suite

var express = require('express');
var cors = require('cors')
var app = express();
app.use(cors())
var server = app.listen(3000);

var thymio = { "node": "mynode", "name": "thymio-II", "protocolVersion": 9, "aeslId": 47150, "connected": 0, "bytecodeSize": 1534, "variablesSize": 640, "stackSize": 32, "namedVariables": { "_id": 1, "event.source": 1, "event.args": 32, "_fwversion": 2, "_productId": 1, "buttons._raw": 5, "button.backward": 1, "button.left": 1, "button.center": 1, "button.forward": 1, "button.right": 1, "buttons._mean": 5, "buttons._noise": 5, "prox.horizontal": 7, "prox.comm.rx._payloads": 7, "prox.comm.rx._intensities": 7, "prox.comm.rx": 1, "prox.comm.tx": 1, "prox.ground.ambiant": 2, "prox.ground.reflected": 2, "prox.ground.delta": 2, "motor.left.target": 1, "motor.right.target": 1, "_vbat": 2, "_imot": 2, "motor.left.speed": 1, "motor.right.speed": 1, "motor.left.pwm": 1, "motor.right.pwm": 1, "_integrator": 2, "acc": 3, "leds.top": 3, "leds.bottom.left": 3, "leds.bottom.right": 3, "leds.circle": 8, "temperature": 1, "rc5.address": 1, "rc5.command": 1, "mic.intensity": 1, "mic.threshold": 1, "mic._mean": 1, "timer.period": 2, "acc._tap": 1, "sd.present": 1 }, "localEvents": { "button.backward": "Backward button status changed", "button.left": "Left button status changed", "button.center": "Center button status changed", "button.forward": "Forward button status changed", "button.right": "Right button status changed", "buttons": "Buttons values updated", "prox": "Proximity values updated", "prox.comm": "Data received on the proximity communication", "tap": "A tap is detected", "acc": "Accelerometer values updated", "mic": "Fired when microphone intensity is above threshold", "": "", "": "", "": "", "": "", "": "", "": "" }, "constants": {}, "events": {} };

var data = [0];

var socket;
var io = require('socket.io').listen(server);
io.sockets.on('connection', newConnection);

function newConnection(_socket) {
    socket = _socket;
    console.log('new connection: ' + socket.id);
    socket.on('thymio', thymioMsg);
    //console.log(socket);
}
function thymioMsg(_data) {
    data = _data;
    io.sockets.emit('thymio', data);

}
app.use(express.static('dist'));

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  });
app.get('/fake', showJSON);
function showJSON(req, res) {
    res.send(thymio);
    //res.send(data);
    console.log('Got a GET request at /nodes serving thymio static var')
}
app.get('/nodes', showThymioUpdate);
function showThymioUpdate(req, res) {
    res.send(data);
    console.log('Got a GET request at /nodes serving thymio static var')
}
console.log("Thymio Suite HTTP server running at http://127.0.0.1:3000");

app.put('/nodes/test/:test', function (req, res) {
    res.send('Got a PUT request at /nodes');
    console.log('Got a PUT request at /nodes',req.params);
});
app.put('/nodes/led/:led', function (req, res) {
    res.send('Got a PUT request at /led');
    console.log('Got a PUT request at /led',req.params);
    io.sockets.emit('led', req.params);
});
app.put('/nodes/M_motor_both/:speed', function (req, res) {
    res.send('Got a PUT request at /M_motor_both');
    console.log('Got a PUT request M_motor_both',req.params);
    io.sockets.emit('M_motor_both', req.params);
});
app.put('/nodes/M_motor_left/:speed', function (req, res) {
    res.send('Got a PUT request at /M_motor_left');
    console.log('Got a PUT request M_motor_left',req.params);
    io.sockets.emit('M_motor_left', req.params);
});
app.put('/nodes/M_motor_right/:speed', function (req, res) {
    res.send('Got a PUT request at /M_motor_right');
    console.log('Got a PUT request M_motor_right',req.params);
    io.sockets.emit('M_motor_right', req.params);
});
app.put('/nodes/stop/:stop', function (req, res) {
    res.send('Got a PUT request at /stop');
    console.log('Got a PUT request at /stop',req.params);
    io.sockets.emit('stop', req.params);
});


