import { createClient, Node, NodeStatus, Request, setup } from '@mobsya-association/thymio-api'

//Connect to the Thymio Suite
//We will need some way to get that url
let client = createClient("ws://localhost:8597");
let selectedNode = undefined;
let thymioPrograms = [];

var socket = io.connect('ws://localhost:3000');


// TEST Events
socket.on('Led', thymioLED);
async function thymioLED(data) {
    console.log('LED avec paramètre', data.args);
    await selectedNode.emitEvents({ "ping": null });
    //socket.emit('thymio', data);
}


//LEDs Events from Socket.io to Thymio

socket.on('V_leds_prox_h', thymioV_leds_prox_h);
async function thymioV_leds_prox_h(data) {
    console.log('V_leds_prox_h avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_prox_h": data});
}
socket.on('V_leds_circle', thymioV_leds_circle);
async function thymioV_leds_circle(data) {
    console.log('V_leds_circle avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_circle": data});
}
socket.on('V_leds_top', thymioV_leds_top);
async function thymioV_leds_top(data) {
    console.log('V_leds_top avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_top": data});
}
socket.on('V_leds_bottom', thymioV_leds_bottom);
async function thymioV_leds_bottom(data) {
    console.log('V_leds_bottom avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_bottom": data});
}
socket.on('V_leds_prox_v', thymioV_leds_prox_v);
async function thymioV_leds_prox_v(data) {
    console.log('V_leds_prox_v avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_prox_v": data});
}
socket.on('V_leds_buttons', thymioV_leds_buttons);
async function thymioV_leds_buttons(data) {
    console.log('V_leds_buttons avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_buttons": data});
}
socket.on('V_leds_rc', thymioV_leds_rc);
async function thymioV_leds_rc(data) {
    console.log('V_leds_rc avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_rc": data});
}
socket.on('V_leds_temperature', thymioV_leds_temperature);
async function thymioV_leds_temperature(data) {
    console.log('V_leds_temperature avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_temperature": data});
}
socket.on('V_leds_sound', thymioV_leds_sound);
async function thymioV_leds_sound(data) {
    console.log('V_leds_sound avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_sound": data});
}

// Sound Events from Socket.io to Thymio
socket.on('A_sound_system', thymioA_sound_system);
async function thymioA_sound_system(data) {
    console.log('A_sound_system avec paramètre', data);
    await selectedNode.emitEvents({ "A_sound_system": data});
}
socket.on('A_sound_freq', thymioA_sound_freq);
async function thymioA_sound_freq(data) {
    console.log('A_sound_freq avec paramètres', data);
    await selectedNode.emitEvents({ "A_sound_freq": data});
}
socket.on('A_sound_play', thymioA_sound_play);
async function thymioA_sound_play(data) {
    console.log('A_sound_play avec paramètre', data);
    await selectedNode.emitEvents({ "A_sound_play": data});
}
socket.on('A_sound_record', thymioA_sound_record);
async function thymioA_sound_record(data) {
    console.log('A_sound_record avec paramètre', data);
    await selectedNode.emitEvents({ "A_sound_record": data});
}
socket.on('A_sound_replay', thymioA_sound_replay);
async function thymioA_sound_replay(data) {
    console.log('A_sound_replay avec paramètre', data);
    await selectedNode.emitEvents({ "A_sound_replay": data});
}

// Motors Events from Socket.io to Thymio
socket.on('M_motor_both', thymioM_motor_both);
async function thymioM_motor_both(data) {
    console.log('M_motor_both avec paramètre', data);
    await selectedNode.emitEvents({ "M_motor_both": data});
}
socket.on('M_motor_left', thymioM_motor_left);
async function thymioM_motor_left(data) {
    console.log('M_motor_left avec paramètre', data);
    await selectedNode.emitEvents({ "M_motor_left": data});
}
socket.on('M_motor_right', thymioM_motor_right);
async function thymioM_motor_right(data) {
    console.log('M_motor_right avec paramètre', data);
    await selectedNode.emitEvents({ "M_motor_right": data});
}


socket.on('thymio', thymioUpdate);
function thymioUpdate(data) {
    //console.log(data);
    socket.emit('thymio', data);
}

async function thymioSetup() {
    try {
        thymioSetupPrograms();
        await selectedNode.sendAsebaProgram(thymioPrograms[0]);
        await selectedNode.runProgram();
    } catch (e) {
        console.log(e);
    }
}

async function thymioDraw(data) {
    try {
        //await selectedNode.emitEvents({ "ping": null });
        socket.emit('thymio', data);
    } catch (e) {
        console.log(e);
    }
}

async function thymioSetupPrograms() {

    // Basic Test
    thymioPrograms.push(`
    var rgb[3]
    var tmp[3]
    var i = 0

    onevent ping
        call math.rand(rgb)
        for i in 0:2 do
            rgb[i] = abs rgb[i]
            rgb[i] = rgb[i] % 20
        end
        call leds.top(rgb[0], rgb[1], rgb[2])
        i++
        emit pong i  


    onevent V_leds_bottom
        if event.args[0]==0 then
            call leds.bottom.left(event.args[1],event.args[2],event.args[3])
        else
            call leds.bottom.right(event.args[1],event.args[2],event.args[3])
        end
    onevent V_leds_buttons
        call leds.buttons(event.args[0],event.args[1],
                          event.args[2],event.args[3])    
    onevent V_leds_circle
        call leds.circle(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
    onevent V_leds_prox_h
        call leds.prox.h(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
    onevent V_leds_prox_v
        call leds.prox.v(event.args[0],event.args[1])
    onevent V_leds_rc
        call leds.rc(event.args[0])   
    onevent V_leds_sound
        call leds.sound(event.args[0])
    onevent V_leds_temperature
        call leds.temperature(event.args[0],event.args[1])
    onevent V_leds_top
        call leds.top(event.args[0],event.args[1],event.args[2])
    onevent A_sound_system
        call sound.system(event.args[0])
    onevent A_sound_freq
        call sound.freq(event.args[0],event.args[1])
    onevent A_sound_play
        call sound.play(event.args[0])
    onevent A_sound_record
        call sound.record(event.args[0])
    onevent A_sound_replay
        call sound.replay(event.args[0])
    onevent M_motor_both 
        motor.left.target = event.args[0]
        motor.right.target = event.args[1] 
    onevent M_motor_left
        motor.left.target = event.args[0]
    onevent M_motor_right
        motor.right.target = event.args[0] 
        
    `);

    thymioPrograms.push(`
    `);
}

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
        //Iterate over the nodes
        for (let node of nodes) {
            console.log(`${node.id} : ${node.statusAsString}`)
            // Select the first non busy node
            if ((!selectedNode || selectedNode.status != NodeStatus.ready) && node.status == NodeStatus.available) {
                try {
                    console.log(`Locking ${node.id}`)
                    // Lock (take ownership) of the node. We cannot mutate a node (send code to it), until we have a lock on it
                    // Once locked, a node will appear busy / unavailable to other clients until we close the connection or call `unlock` explicitely
                    // We can lock as many nodes as we want
                    await node.lock();
                    selectedNode = node
                    console.log("Node locked")
                    console.log(node)
                } catch (e) {
                    console.log(`Unable To Log ${node.id} (${node.name})`)
                }
            }
            if (!selectedNode)
                continue
            try {

                //This is requiered in order to receive the variables and node of a group
                node.watchSharedVariablesAndEvents(true)

                //Monitor the shared variables - note that because this callback is set on a group
                //It does not track group changes
                node.group.onVariablesChanged = (vars) => {
                    console.log("shared variables : ", vars)
                }

                //Monitor the event descriptions - note that because this callback is set on a group, it does not track group changes
                node.group.onEventsDescriptionsChanged = (events) => {
                    console.log("descriptions", events)
                }

                //Monitor variable changes
                node.onVariablesChanged = (vars) => {
                    thymioDraw(vars);
                }

                //Monitor events
                node.onEvents = async (events) => {
                    console.log("events", events)
                    let { pong: pong } = events;
                    if (pong) {
                        await sleep(1000)
                        await node.emitEvents({ "ping": null })
                    }
                }

                await node.group.setEventsDescriptions([
                    { name: "ping", fixed_size: 0 },
                    { name: "pong", fixed_size: 1 },

                    { name: "Q_add_motion", fixed_size: 4 },
                    { name: "Q_cancel_motion", fixed_size: 1 },
                    { name: "Q_motion_added", fixed_size: 5 },
                    { name: "Q_motion_cancelled", fixed_size: 5 },
                    { name: "Q_motion_started", fixed_size: 5 },
                    { name: "Q_motion_ended", fixed_size: 5 },
                    { name: "Q_motion_noneleft", fixed_size: 1 },
                    { name: "Q_set_odometer", fixed_size: 3 },

                    { name: "V_leds_prox_h", fixed_size: 8 },
                    { name: "V_leds_circle", fixed_size: 8 },
                    { name: "V_leds_top", fixed_size: 3 },
                    { name: "V_leds_bottom", fixed_size: 4 },
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
                

                    { name: "R_state_update", fixed_size: 27 },
                    { name: "Q_reset", fixed_size: 0 }
                ]);
                thymioSetup();

            }
            catch (e) {
                console.log(e)
                //process.exit()
            }
        }
    } catch (e) {
        console.log(e)
        // process.exit()
    }
}

