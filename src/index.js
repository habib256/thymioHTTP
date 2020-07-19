import { createClient, Node, NodeStatus, Request, setup } from '@mobsya-association/thymio-api'

//Connect to the Thymio Suite
//We will need some way to get that url
let client = createClient("ws://localhost:8597");
let selectedNode = undefined;
let thymioPrograms = [];

var socket = io.connect('ws://localhost:3000');

socket.on('led', thymioLED);
async function thymioLED(data) {
    console.log('LED avec paramètre', data.led);
    await selectedNode.emitEvents({ "ping": null });
    //socket.emit('thymio', data);
}
socket.on('M_motor_both', thymioM_motor_both);
async function thymioM_motor_both(data) {
    console.log('M_motor_both avec paramètre', data.speed);
    let speed = Int16Array.of(data.speed);
    console.log(speed);
    await selectedNode.emitEvents({ "M_motor_both": speed});
}
socket.on('M_motor_left', thymioM_motor_left);
async function thymioM_motor_left(data) {
    console.log('M_motor_left avec paramètre', data.speed);
    let speed = Int16Array.of(data.speed);
    console.log(speed);
    await selectedNode.emitEvents({ "M_motor_left": speed});
}
socket.on('M_motor_right', thymioM_motor_right);
async function thymioM_motor_right(data) {
    console.log('M_motor_right avec paramètre', data.speed);
    let speed = Int16Array.of(data.speed);
    console.log(speed);
    await selectedNode.emitEvents({ "M_motor_right": speed});
}
socket.on('stop', thymioStop);
async function thymioStop(data) {
    console.log('stop avec paramètre', data.stop);
    await selectedNode.emitEvents({ "stop": null });
    //socket.emit('thymio', data);
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
    onevent M_motor_both 
        motor.left.target = event.args[0]
        motor.right.target = event.args[0] 
    onevent M_motor_left
        motor.left.target = event.args[0]
    onevent M_motor_right
        motor.right.target = event.args[0] 
    onevent stop
        motor.left.target = 0
        motor.right.target = 0
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
                    { name: "stop", fixed_size: 0 },
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
                    { name: "M_motor_left", fixed_size: 1 },
                    { name: "M_motor_right", fixed_size: 1 },
                    { name: "M_motor_both", fixed_size: 1 },
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

