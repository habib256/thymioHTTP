// ThymioHTTP via Javascript for Thymio Suite 2.X
// APACHE 2.0 License - VERHILLE Arnaud

import { createClient, Node, NodeStatus, Request, setup } from '@mobsya-association/thymio-api'

//Connect to the Thymio Suite
//We will need some way to get that url
let client = createClient("ws://localhost:8597")

// The Full List of all working Thymio(s) nodes
let myNodes = []

let thymioSelected = 1
let thymioPrograms = []

let thymio_state = []

var socket = io.connect('ws://localhost:3000')

// Select Thymio
socket.on('thymio', thymioSelect)
async function thymioSelect(data) {
    try {
        thymioSelected = parseInt(data)
        console.log('Select Thymio : ', thymioSelected)
    } catch (e) {
        console.log("Select Thymio error : ", e)
    }
}

// CODE Upload Events
socket.on('code', thymioCode)
async function thymioCode(data) {
    try {
        var s_obj = new String(data)
        console.log("Upload Program", s_obj)

        if ((thymioSelected > myNodes.length) || (thymioSelected == 0)) {
            console.log('ERROR: Thymio ', thymioSelected, ' do not exist !!')
        } else {
            await myNodes[thymioSelected - 1].sendAsebaProgram(s_obj)
            await myNodes[thymioSelected - 1].runProgram();
        }
    } catch (e) {
        console.log("Upload Aseba code error : ", e)
    }
}

// PING Events
socket.on('ping', thymioPing);
async function thymioPing(data) {
    console.log('Ping to selected thymio node: ', myNodes)
    await myNodes[thymioSelected-1].emitEvents({ "ping": null })
}

//LEDs Events from Socket.io to Thymio
socket.on('V_leds_prox_h', thymioV_leds_prox_h)
async function thymioV_leds_prox_h(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_prox_h": data })
}
socket.on('V_leds_circle', thymioV_leds_circle)
async function thymioV_leds_circle(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_circle": data })
}
socket.on('V_leds_top', thymioV_leds_top)
async function thymioV_leds_top(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_top": data })
}
socket.on('V_leds_bottom_left', thymioV_leds_bottom_left)
async function thymioV_leds_bottom_left(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_bottom_left": data })
}
socket.on('V_leds_bottom_right', thymioV_leds_bottom_right)
async function thymioV_leds_bottom_right(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_bottom_right": data })
}
socket.on('V_leds_prox_v', thymioV_leds_prox_v)
async function thymioV_leds_prox_v(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_prox_v": data })
}
socket.on('V_leds_buttons', thymioV_leds_buttons);
async function thymioV_leds_buttons(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_buttons": data })
}
socket.on('V_leds_rc', thymioV_leds_rc)
async function thymioV_leds_rc(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_rc": data })
}
socket.on('V_leds_temperature', thymioV_leds_temperature)
async function thymioV_leds_temperature(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_temperature": data })
}
socket.on('V_leds_sound', thymioV_leds_sound)
async function thymioV_leds_sound(data) {
        await myNodes[thymioSelected-1].emitEvents({ "V_leds_sound": data })
}

// Sound Events from Socket.io to Thymio
socket.on('A_sound_system', thymioA_sound_system)
async function thymioA_sound_system(data) {
        await myNodes[thymioSelected-1].emitEvents({ "A_sound_system": data })
}
socket.on('A_sound_freq', thymioA_sound_freq);
async function thymioA_sound_freq(data) {
        await myNodes[thymioSelected-1].emitEvents({ "A_sound_freq": data })
}
socket.on('A_sound_play', thymioA_sound_play)
async function thymioA_sound_play(data) {
        await myNodes[thymioSelected-1].emitEvents({ "A_sound_play": data })
}
socket.on('A_sound_record', thymioA_sound_record)
async function thymioA_sound_record(data) {
    await myNodes[thymioSelected-1].emitEvents({ "A_sound_record": data })
}
socket.on('A_sound_replay', thymioA_sound_replay)
async function thymioA_sound_replay(data) {
        await myNodes[thymioSelected-1].emitEvents({ "A_sound_replay": data })
}

// Motors Events from Socket.io to Thymio
socket.on('M_motor_both', thymioM_motor_both)
async function thymioM_motor_both(data) {
    await myNodes[thymioSelected-1].emitEvents({ "M_motor_both": data })
}
socket.on('M_motor_left', thymioM_motor_left)
async function thymioM_motor_left(data) {
        await myNodes[thymioSelected-1].emitEvents({ "M_motor_left": data })
}
socket.on('M_motor_right', thymioM_motor_right)
async function thymioM_motor_right(data) {
        await myNodes[thymioSelected-1].emitEvents({ "M_motor_right": data })
}

socket.on('M_motor_timed', thymioM_motor_timed)
async function thymioM_motor_timed(data) {
        await myNodes[thymioSelected-1].emitEvents({ "M_motor_timed": data })
}

socket.on('Q_reset', thymioQ_reset)
async function thymioQ_reset(data) {
        await myNodes[thymioSelected-1].emitEvents({ "Q_reset": null })
}

// ********** CONTROL THYMIO FROM JAVASCRIPT HERE  ***************
// ***************************************************************

socket.on('thymio', thymioUpdate);
function thymioUpdate(data) {
    socket.send('myNodes', myNodes);
}

async function thymioSetup() {
    try {
        thymioSetupPrograms();

        // Supprimer les nodes deconnectés
        for (let i = 0; i < myNodes.length; i++) {
            if (myNodes[i].status == NodeStatus.disconnected) {
                myNodes.splice(i, 1);
                i--;
            }
        }

        // Charger le programme aseba sur chaque(s) Thymio(s)
        for (let node of myNodes) {
            await node.sendAsebaProgram(thymioPrograms[0]);
            await node.runProgram();
        }

    } catch (e) {
        console.log("Aseba code error : ", e);
    }
}

async function thymioDraw(data) {
    try {
        // Thymio Firmware send all updated variables here
        var _data = JSON.stringify(Array.from(data.entries()))
        _data = JSON.parse(_data)

        for (let mydata of _data) {

            if (mydata[0] == "acc") {
                thymio_state[0] = mydata[1][0]
                thymio_state[1] = mydata[1][1]
                thymio_state[2] = mydata[1][2]
                //  console.log("variable acc:  \tax: " + thymio_state[0] + "  \tay: " + thymio_state[1] + " \taz: " + thymio_state[2])

            }
            if (mydata[0] == "mic.intensity") {
                thymio_state[3] = mydata[1]
                // console.log("variable mic.intensity: " + thymio_state[3])
            }
            if (mydata[0] == "button.backward") {
                thymio_state[4] = mydata[1]
                // console.log("variable button.backward: " + mydata[1])
            }
            if (mydata[0] == "button.center") {
                thymio_state[5] = mydata[1]
                // console.log("variable button.center: " + mydata[1])
            }
            if (mydata[0] == "button.forward") {
                thymio_state[6] = mydata[1]
                // console.log("variable button.backward: " + mydata[1])
            }
            if (mydata[0] == "button.left") {
                thymio_state[7] = mydata[1]
                // console.log("variable button.left: " + mydata[1])
            }
            if (mydata[0] == "button.right") {
                thymio_state[8] = mydata[1]
                //  console.log("variable button.right: " + mydata[1])
            }
            if (mydata[0] == "motor.left.target") {
                thymio_state[9] = mydata[1]
                //  console.log("variable motor.left.target: " + mydata[1])
            }
            if (mydata[0] == "motor.right.target") {
                thymio_state[10] = mydata[1]
                // console.log("variable motor.right.target: " + mydata[1])
            }
            if (mydata[0] == "motor.left.speed") {
                thymio_state[11] = mydata[1]
                //  console.log("variable motor.left.speed: " + mydata[1])
            }
            if (mydata[0] == "motor.right.speed") {
                thymio_state[12] = mydata[1]
                // console.log("variable motor.right.speed: " + mydata[1])
            }
            if (mydata[0] == "prox.comm.rx") {
                thymio_state[13] = mydata[1]
                // console.log("variable prox.comm.rx: " + mydata[1])
            }
            if (mydata[0] == "prox.comm.tx") {
                thymio_state[14] = mydata[1]
                //  console.log("variable prox.comm.tx: " + mydata[1])
            }
            if (mydata[0] == "prox.ground.delta") {
                thymio_state[15] = mydata[1][0]
                thymio_state[16] = mydata[1][1]
                //  console.log("variable prox].ground.delta: " + mydata[1])
            }
            if (mydata[0] == "prox.horizontal") {
                thymio_state[17] = mydata[1][0]
                thymio_state[18] = mydata[1][1]
                thymio_state[19] = mydata[1][2]
                thymio_state[20] = mydata[1][3]
                thymio_state[21] = mydata[1][4]
                thymio_state[22] = mydata[1][5]
                thymio_state[23] = mydata[1][6]
                //  console.log("variable prox.horizontal: " + mydata[1])
            }
            if (mydata[0] == "temperature") {
                thymio_state[24] = mydata[1]
                //console.log("variable temperature: " + thymio_state[24])
            }
            if (mydata[0] == "motorbusy") {
                thymio_state[25] = mydata[1]
                // console.log("variable motorbusy: " + mydata[1])
            }

            // Need to work with the variables under the line
            /////////////////////////////////////////////////
            if (mydata[0] == "_fwversion") {
                // console.log("variable _fwversion: " + mydata[1])
            }
            if (mydata[0] == "_id") {
                // console.log("variable _id: " + mydata[1])
            }
            if (mydata[0] == "_imot") {
                //console.log("variable _imot: " + mydata[1])
            }
            if (mydata[0] == "_integrator") {
                // console.log("variable _integrator: " + mydata[1])
            }
            if (mydata[0] == "_productId") {
                //console.log("variable _productId: " + mydata[1])
            }
            if (mydata[0] == "_vbat") {
                // console.log("variable _vbat: " + mydata[1])
            }

            if (mydata[0] == "acc._tap") {
                // console.log("variable acc._tap: " + mydata[1])
            }
            if (mydata[0] == "buttons._mean") {
                // console.log("variable buttons._mean: " + mydata[1])
            }
            if (mydata[0] == "buttons._noise") {
                // console.log("variable buttons._noise: " + mydata[1])
            }
            if (mydata[0] == "buttons._raw") {
                // console.log("variable buttons._raw: " + mydata[1])
            }
            if (mydata[0] == "event.args") {
                // console.log("variable event.args: " + mydata[1])
            }
            if (mydata[0] == "event.source") {
                // console.log("variable event.source: " + mydata[1])
            }
            if (mydata[0] == "leds.bottom.left") {
                // console.log("variable leds.bottom.left: " + mydata[1])
            }
            if (mydata[0] == "leds.bottom.right") {
                // console.log("variable leds.bottom.right: " + mydata[1])
            }
            if (mydata[0] == "leds.circle") {
                //  console.log("variable leds.circle: " + mydata[1])
            }
            if (mydata[0] == "leds.top") {
                //  console.log("variable leds.top: " + mydata[1])
            }
            if (mydata[0] == "mic._mean") {
                //  console.log("variable mic._mean: " + mydata[1])
            }
            if (mydata[0] == "mic.threshold") {
                // console.log("variable mic.threshold: " + mydata[1])
            }
            if (mydata[0] == "motor.left.pwm") {
                //  console.log("variable motor.left.pwm: " + mydata[1])
            }
            if (mydata[0] == "motor.right.pwm") {
                //  console.log("variable motor.right.pwm: " + mydata[1])
            }
            if (mydata[0] == "prox.comm.rx._intensities") {
                // console.log("variable prox.comm.rx._intensities: " + mydata[1])
            }
            if (mydata[0] == "prox.comm.rx._payloads") {
                //  console.log("variable prox.comm.rx._payloads: " + mydata[1])
            }

            if (mydata[0] == "prox.ground.ambiant") {
                //  console.log("variable prox.ground.ambiant: " + mydata[1])
            }
            if (mydata[0] == "prox.ground.reflected") {
                //  console.log("variable prox.ground.reflected: " + mydata[1])
            }
            if (mydata[0] == "rc5.address") {
                //  console.log("variable rc5.address: " + mydata[1])
            }
            if (mydata[0] == "rc5.command") {
                // console.log("variable rc5.command: " + mydata[1])
            }
            if (mydata[0] == "sd.present") {
                //  console.log("variable sd.present: " + mydata[1])
            }
            if (mydata[0] == "timer.period") {
                //  console.log("variable timer.period: " + mydata[1])
            }
        }
        //console.log(thymio_state)
        //io.socket.emit('update_vars', datatest);
        //socket.emit('update_vars', datatest)
        socket.emit('thymio', thymio_state);
    } catch (e) {
        console.log(e)
    }
}

// ******************  THYMIO NODES GESTION  *********************
// ***************************************************************

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.onClose = async (event) => {
    console.log(event);
}

// Start monitoring for node event
// A node will have the state
//      * connected    : Connected but vm description unavailable - little can be done in this state
//      * available    : The node is available, we can start communicating with it
//      * ready        : We have an excusive lock on the node and can start sending code to it.
//      * busy         : The node is locked by someone else.
//      * disconnected : The node is gone
client.onNodesChanged = async (nodes) => {
    try {
        //console.log("Detection de ",nodes.length," Thymio(s) sur le HUB Thymio Suite 2")
        //Iterate over the nodes
        for (let node of nodes) {

            if (node.status != NodeStatus.available) {
                console.log(`${node.id} : ${node.statusAsString} : ${node.name} `)
            }

            // Select the first non busy node
            if (node.status == NodeStatus.available) {
                try {
                    //console.log(`Locking ${node.id}`)
                    // Lock (take ownership) of the node. We cannot mutate a node (send code to it), until we have a lock on it
                    // Once locked, a node will appear busy / unavailable to other clients until we close the connection or call `unlock` explicitely
                    // We can lock as many nodes as we want
                    await node.lock();
                    myNodes.push(node);
                } catch (e) {
                    console.log(`Unable To Log ${node.id} (${node.name})`)
                }
            }


            if (node.status == NodeStatus.available)
                continue
            try {

                //This is requiered in order to receive the variables and node of a group
                node.watchSharedVariablesAndEvents(true)

                //Monitor the shared variables - note that because this callback is set on a group
                //It does not track group changes
                node.group.onVariablesChanged = (vars) => {
                    // console.log("shared variables : ", vars)
                }

                //Monitor the event descriptions - note that because this callback is set on a group, it does not track group changes
                node.group.onEventsDescriptionsChanged = (events) => {
                    // console.log("descriptions", events)
                }

                //Monitor variable changes
                node.onVariablesChanged = (vars) => {
                    thymioDraw(vars);
                }

                // Monitor events from thymio
                node.onEvents = async (events) => {
                    //console.log("events", events)
                    // Mainly R_state_update Broadcast to socket.io
                    //socket.emit('thymio', events);
                    //let { pong: pong } = events;
                    //if (pong) {
                    //}
                }



                // Thymio Events List 
                // Need to be updated if you want to create new events in aseba code
                await node.group.setEventsDescriptions([
                    { name: "ping", fixed_size: 0 },

                    { name: "V_leds_prox_h", fixed_size: 8 },
                    { name: "V_leds_circle", fixed_size: 8 },
                    { name: "V_leds_top", fixed_size: 3 },
                    { name: "V_leds_bottom_left", fixed_size: 3 },
                    { name: "V_leds_bottom_right", fixed_size: 3 },
                    { name: "V_leds_prox_v", fixed_size: 2 },
                    { name: "V_leds_buttons", fixed_size: 4 },
                    { name: "V_leds_rc", fixed_size: 1 },
                    { name: "V_leds_temperature", fixed_size: 2 },
                    { name: "V_leds_sound", fixed_size: 1 },

                    { name: "A_sound_freq", fixed_size: 2 },
                    { name: "A_sound_play", fixed_size: 1 },
                    { name: "A_sound_system", fixed_size: 1 },
                    { name: "A_sound_replay", fixed_size: 1 },
                    { name: "A_sound_record", fixed_size: 1 },

                    { name: "M_motor_both", fixed_size: 2 },
                    { name: "M_motor_left", fixed_size: 1 },
                    { name: "M_motor_right", fixed_size: 1 },
                    { name: "M_motor_timed", fixed_size: 3 }

                ]);

            }
            catch (e) {

                //console.log(e)
                //process.exit()
            }
        }
        // End of  : for (let node of nodes)
        // console.log( myNodes.length, "node(s) in myNodes",myNodes)

    } catch (e) {

        //console.log(e)
        //process.exit()
    }
    thymioSetup();
}

// ******************  ASEBA PROGRAMS  *****************************
// ***************************************************************
async function thymioSetupPrograms() {

    // Thymio Motion AESL for Control by HTTP
    thymioPrograms.push(`
    
    ##! Basic Thymio Motion AESL
    ##! David J Sherman - david.sherman@inria.fr
    ##! Nathalie Carrie - IREM de la Réunion
    ##! Arnaud Verhille - gist974arobasegmailpointcom
    ##! This AESL program defines high-level behaviors for the Thymio-II robot that enable
    ##! it to cooperate with programs like Snap! using Nodejs and thymioHTTP REST API
    var motorbusy
    var i
    var r
    var g
    var b
    motorbusy = 0
    i = 0
    mic.threshold = 12
    motor.left.target=0
    motor.right.target=0
    call sound.system(3)
    ##! MOTOR THYMIO EVENTS
    
    onevent M_motor_both
        motor.left.target=event.args[0]
        motor.right.target=event.args[1]
    
    
    onevent M_motor_timed
        motor.left.target=event.args[0]
        motor.right.target=event.args[1]
        timer.period[0] = event.args[2]
        motorbusy = 1
    
    
    onevent timer0
        motor.left.target=0
        motor.right.target=0
        motorbusy = 0
        timer.period[0] = 0
    
    ##! LED THYMIO EVENTS
    
    onevent V_leds_prox_h
        call leds.prox.h(event.args[0],event.args[1],event.args[2],event.args[3],event.args[4],event.args[5],event.args[6],event.args[7])
    
    
    onevent V_leds_circle
        call leds.circle(event.args[0],event.args[1],event.args[2],event.args[3],event.args[4],event.args[5],event.args[6],event.args[7])
    
    
    onevent V_leds_top
        call leds.top(event.args[0],event.args[1],event.args[2])
    
    
    onevent V_leds_bottom_left
        call leds.bottom.left(event.args[0],event.args[1],event.args[2])
    
    
    onevent V_leds_bottom_right
        call leds.bottom.right(event.args[0],event.args[1],event.args[2])
    
    
    onevent V_leds_prox_v
        call leds.prox.v(event.args[0],event.args[1])
    
    
    onevent V_leds_buttons
        call leds.buttons(event.args[0],event.args[1],event.args[2],event.args[3])
    
    
    onevent V_leds_rc
        call leds.rc(event.args[0])
    
    
    onevent V_leds_temperature
        call leds.temperature(event.args[0],event.args[1])
    
    
    onevent V_leds_sound
        call leds.sound(event.args[0])
    
    ##! SOUND THYMIO EVENTS
    
    onevent A_sound_system
        call sound.system(event.args[0])
    
    
    onevent A_sound_play
        call sound.play(event.args[0])
    
    
    onevent A_sound_replay
        call sound.replay(event.args[0])
    
    
    onevent A_sound_record
        call sound.record(event.args[0])
    
    
    onevent A_sound_freq
        call sound.freq(event.args[0],event.args[1])
    
    ##! BUTTONS THYMIO EVENTS
    
    onevent button.center
        call math.rand(r)
        r = abs r
        r = r % 20
        call math.rand(g)
        g = abs g
        g = g % 20
        call math.rand(b)
        b = abs b
        b = b % 20
        call leds.top(r,g,b)

    `);
}


