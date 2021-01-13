// ThymioHTTP via Javascript for Thymio Suite 2.X
// APACHE 2.0 License - VERHILLE Arnaud

var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express();
var server = app.listen(3000);

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const multer = require('multer')
const upload = multer() // for parsing multipart/form-data

app.use(cors())
app.use(bodyParser.text())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var data = [0];

var socket;
var io = require('socket.io').listen(server);

io.sockets.on('connection', newConnection);
function newConnection(_socket) {
    socket = _socket;
    console.log('new connection: ' + socket.id);
    socket.on('thymio', thymioMsg);
}

io.sockets.on('myNodes', updateNodes);
function updateNodes(_socket) {
    console.log('socket on myNode')
    console.log(_socket)
   // socket = _socket;
   // console.log('new connection: ' + socket.id);
   // socket.on('thymio', thymioMsg);
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
    //console.log('Got a PUT request at ping');
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
app.put('/nodes/M_motor_timed/:left/:right/:time', function (req, res) {
    res.send('Got a PUT request at M_motor_timed');
    let args = Int16Array.of(req.params.left,req.params.right,req.params.time);
  //  console.log('Got a PUT request M_motor_timed',args);
    io.sockets.emit('M_motor_timed', args);
});
app.put('/nodes/Q_reset/', function (req, res) {
    res.send('Got a PUT request at Q_reset');
    let args = Int16Array.of(req.params.left,req.params.right,req.params.time);
    //console.log('Got THYMIO Q_reset');
    io.sockets.emit('Q_reset', null);
});

app.put('/nodes/code/'  ,upload.array(), function (req, res, next) {
    res.send('Got a PUT request at THYMIO code upload request');
    console.log('Got THYMIO code upload request');
    //console.log(req.body)
    //res.json(req.body)
    //io.sockets.emit('code', args)
});

// Api url 
app.post('/nodes/code/', (req, res) => {
    // do something
    console.log(req.body)
    res.send("POST Upload Thymio reçu :")
    io.sockets.emit('code', req.body)
  })

  app.post('/nodes/jsoncode/', (req, res) => {

    const bodyJson = JSON.parse(req.body)
    console.log(bodyJson)
    // do something
    res.send(bodyJson)
  
  })

  // POST /api/users gets JSON bodies
  //app.post('/nodes/code/' , function (req, res) {
  //  console.log("Received:"+require('util').inspect(req.body,{depth:null}))
  //  res.send("POST Upload Thymio reçu")
  //})


