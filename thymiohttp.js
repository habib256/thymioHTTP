// ThymioHTTP via Javascript for Thymio Suite

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
}

//
function thymioMsg(_data) {
    data = _data;
   // io.sockets.emit('thymio', data);
}


app.use(express.static('dist'));

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  });
app.get('/fake', showJSON);
function showJSON(req, res) {
    res.send(thymio);
    //res.send(data);
   // console.log('Got a GET request at /nodes serving thymio static var')
}
app.get('/nodes', showThymioUpdate);
function showThymioUpdate(req, res) {
    res.send(data);
    //console.log('Got a GET request at /nodes serving thymio vars')
}
console.log("Thymio Suite HTTP server running at http://127.0.0.1:3000");

// PING HTTP Events to Socket.
app.put('/nodes/ping/', function (req, res) {
    res.send('Got a PUT request at ping');
    console.log('Got a PUT request at ping');
    io.sockets.emit('ping', null);
});

// BEHAVIOR HTTP Events to Socket.
app.put('/nodes/B_behavior/:arg', function (req, res) {
    res.send('Got a PUT request at B_behavior');
    let args = Int16Array.of(req.params.arg);
    io.sockets.emit('B_behavior', args);
});

// ODOMETER HTTP Events to Socket.
app.put('/nodes/Q_set_odometer/:arg1/:arg2/:arg3', function (req, res) {
    res.send('Got a PUT request at Q_set_odometer');
    let args = Int16Array.of(req.params.arg1,req.params.arg2, req.params.arg3);
    io.sockets.emit('Q_set_odometer', args);
});

// LEDs HTTP Events to Socket.
app.put('/nodes/V_leds_prox_h/:arg1/:arg2/:arg3/:arg4/:arg5/:arg6/:arg7/:arg8', function (req, res) {
    res.send('Got a PUT request at V_leds_prox_h');
    let args = Int16Array.of(req.params.arg1,req.params.arg2,req.params.arg3,req.params.arg4,req.params.arg5,req.params.arg6,req.params.arg7,req.params.arg8);
    io.sockets.emit('V_leds_prox_h', args);
});
app.put('/nodes/V_leds_circle/:arg1/:arg2/:arg3/:arg4/:arg5/:arg6/:arg7/:arg8', function (req, res) {
    res.send('Got a PUT request at V_leds_circle');
    let args = Int16Array.of(req.params.arg1,req.params.arg2,req.params.arg3,req.params.arg4,req.params.arg5,req.params.arg6,req.params.arg7,req.params.arg8);
    io.sockets.emit('V_leds_circle', args);
});
app.put('/nodes/V_leds_top/:arg1/:arg2/:arg3', function (req, res) {
    res.send('Got a PUT request at V_leds_top');
    let args = Int16Array.of(req.params.arg1,req.params.arg2, req.params.arg3);
   // console.log('Got a PUT request at V_leds_top',args);
    io.sockets.emit('V_leds_top', args);
});
app.put('/nodes/V_leds_bottom_left/:arg1/:arg2/:arg3', function (req, res) {
    res.send('Got a PUT request at V_leds_bottom_left');
    let args = Int16Array.of(req.params.arg1,req.params.arg2,req.params.arg3);
   // console.log('Got a PUT request at V_leds_bottom_left',args);
    io.sockets.emit('V_leds_bottom_left', args);
});
app.put('/nodes/V_leds_bottom_right/:arg1/:arg2/:arg3', function (req, res) {
    res.send('Got a PUT request at V_leds_bottom_right');
    let args = Int16Array.of(req.params.arg1,req.params.arg2,req.params.arg3);
   // console.log('Got a PUT request at V_leds_bottom_right',args);
    io.sockets.emit('V_leds_bottom_right', args);
});
app.put('/nodes/V_leds_prox_v/:arg1/:arg2', function (req, res) {
    res.send('Got a PUT request at V_leds_prox_v');
    let args = Int16Array.of(req.params.arg1,req.params.arg2);
   // console.log('Got a PUT request at V_leds_prox_v',args);
    io.sockets.emit('V_leds_prox_v', args);
});
app.put('/nodes/V_leds_buttons/:arg1/:arg2/:arg3/:arg4', function (req, res) {
    res.send('Got a PUT request at V_leds_buttons');
    let args = Int16Array.of(req.params.arg1,req.params.arg2,req.params.arg3,req.params.arg4);
   // console.log('Got a PUT request at V_leds_buttons',args);
    io.sockets.emit('V_leds_buttons', args);
});
app.put('/nodes/V_leds_rc/:arg1', function (req, res) {
    res.send('Got a PUT request at V_leds_rc');
    let args = Int16Array.of(req.params.arg1);
   // console.log('Got a PUT request at V_leds_rc',args);
    io.sockets.emit('V_leds_rc', args);
});
app.put('/nodes/V_leds_temperature/:arg1/:arg2', function (req, res) {
    res.send('Got a PUT request at V_leds_temperature');
    let args = Int16Array.of(req.params.arg1,req.params.arg2);
   // console.log('Got a PUT request at V_leds_temperature',args);
    io.sockets.emit('V_leds_temperature', args);
});
app.put('/nodes/V_leds_sound/:arg1', function (req, res) {
    res.send('Got a PUT request at V_leds_sound');
    let args = Int16Array.of(req.params.arg1);
   // console.log('Got a PUT request at V_leds_sound',args);
    io.sockets.emit('V_leds_sound', args);
});



// Sound HTTP Events to Socket.io
app.put('/nodes/A_sound_freq/:freq/:duration', function (req, res) {
    res.send('Got a PUT request at A_sound_freq');
    let args = Int16Array.of(req.params.freq , req.params.duration);
   // console.log('Got a PUT request A_sound_freq',args);
    io.sockets.emit('A_sound_freq', args);
});
app.put('/nodes/A_sound_play/:args', function (req, res) {
    res.send('Got a PUT request at A_sound_play');
    let args = Int16Array.of(req.params.args);
   // console.log('Got a PUT request A_sound_play', args);
    io.sockets.emit('A_sound_play', args);
});
app.put('/nodes/A_sound_system/:args', function (req, res) {
    res.send('Got a PUT request at A_sound_system');
    let args = Int16Array.of(req.params.args);
   // console.log('Got a PUT request A_sound_system', args);
    io.sockets.emit('A_sound_system',  args);
});
app.put('/nodes/A_sound_replay/:args', function (req, res) {
    res.send('Got a PUT request at A_sound_replay');
    let args = Int16Array.of(req.params.args);
  //  console.log('Got a PUT request A_sound_replay', args);
    io.sockets.emit('A_sound_replay',  args);
});
app.put('/nodes/A_sound_record/:args', function (req, res) {
    res.send('Got a PUT request at A_sound_record');
    let args = Int16Array.of(req.params.args);
   // console.log('Got a PUT request A_sound_record', args);
    io.sockets.emit('A_sound_record',  args);
});


// Motor HTTP Events to Socket.io
app.put('/nodes/M_motor_both/:left/:right', function (req, res) {
    res.send('Got a PUT request at M_motor_both');
    let args = Int16Array.of(req.params.left,req.params.right);
  //  console.log('Got a PUT request M_motor_both',args);
    io.sockets.emit('M_motor_both', args);
});
app.put('/nodes/M_motor_left/:args', function (req, res) {
    res.send('Got a PUT request at M_motor_left');
    let args = Int16Array.of(req.params.args);
  //  console.log('Got a PUT request M_motor_left',args);
    io.sockets.emit('M_motor_left', args);
});
app.put('/nodes/M_motor_right/:args', function (req, res) {
    res.send('Got a PUT request at M_motor_right');
    let args = Int16Array.of(req.params.args);
  //  console.log('Got a PUT request M_motor_right',args);
    io.sockets.emit('M_motor_right', args);
});


