import { createClient, Node, NodeStatus, Request, setup } from '@mobsya-association/thymio-api'

//Connect to the Thymio Suite
//We will need some way to get that url
let client = createClient("ws://localhost:8597");
let allNodes = undefined;
let selectedNode = undefined;
let thymioPrograms = [];

var socket = io.connect('ws://localhost:3000');


// PING Events
socket.on('ping', thymioPing);
async function thymioPing(data) {
    console.log('Ping');
    await selectedNode.emitEvents({ "ping": null });
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
socket.on('V_leds_bottom_left', thymioV_leds_bottom_left);
async function thymioV_leds_bottom_left(data) {
    console.log('V_leds_bottom_left avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_bottom_left": data});
}
socket.on('V_leds_bottom_right', thymioV_leds_bottom_right);
async function thymioV_leds_bottom_right(data) {
    console.log('V_leds_bottom_right avec paramètres', data);
    await selectedNode.emitEvents({ "V_leds_bottom_right": data});
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
    socket.emit('thymio', data);
}

async function thymioSetup() {
    try {
        thymioSetupPrograms();
        await selectedNode.sendAsebaProgram(thymioPrograms[1]);
        await selectedNode.runProgram();
    } catch (e) {
        console.log(e);
    }
}

async function thymioDraw(data) {
    try {
        socket.emit('thymio', data);
    } catch (e) {
        console.log(e);
    }
}

async function thymioSetupPrograms() {

    // Basic Test
    thymioPrograms.push(`

    var rgb[3]
    # reusable temp for event handlers
    var tmp[9]
    var i = 0

    var Qid[QUEUE]   = [ 0,0,0,0 ] ##!< [out] task id
    var Qtime[QUEUE] = [ 0,0,0,0 ] ##!< [out] remaining time
    var QspL[QUEUE]  = [ 0,0,0,0 ] ##!< [out] motor speed L
    var QspR[QUEUE]  = [ 0,0,0,0 ] ##!< [out] motor speed R
    var Qpc = 0                    ##!< [out] program counter
    var Qnx = 0                    ##!< [out] next pc

    var distance.front = 190 ##!<  [out] distance front
    var distance.back  = 125 ##!<  [out] distance back
    var angle.front    = 0 ##!<  [out] angle front
    var angle.back     = 0 ##!<  [out] angle back
    var angle.ground   = 0 ##!<  [out] angle ground

    var odo.delta ##!< [out] @private instantaneous speed difference
    var odo.theta = 0 ##!< [out] odometer current angle
    var odo.x = 0 ##!< [out] odometer x
    var odo.y = 0 ##!< [out] odometer y
    var odo.degree ##!< [out] odometer direction

    var R_state.do = 1 ##! flag for R_state broadcast
    var R_state[27] ##! [out] compressed robot state

    ##! THYMIO INTERNAL EVENTS ##########################################

    ##! PING THYMIO EVENTS
    onevent ping
        call math.rand(rgb)
        for i in 0:2 do
            rgb[i] = abs rgb[i]
            rgb[i] = rgb[i] % 20
        end
        call leds.top(rgb[0], rgb[1], rgb[2])
        i++
        emit pong i  

    ##! LED THYMIO EVENTS
    onevent V_leds_prox_h
        call leds.prox.h(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
    onevent V_leds_circle
        call leds.circle(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
     onevent V_leds_top
        call leds.top(event.args[0],event.args[1],event.args[2])
    onevent V_leds_bottom_left
        call leds.bottom.left(event.args[0],event.args[1],event.args[2])
    onevent V_leds_bottom_right
        call leds.bottom.right(event.args[0],event.args[1],event.args[2])
    onevent V_leds_prox_v
        call leds.prox.v(event.args[0],event.args[1])
    onevent V_leds_buttons
        call leds.buttons(event.args[0],event.args[1],
                          event.args[2],event.args[3])    
    onevent V_leds_rc
        call leds.rc(event.args[0])   
    onevent V_leds_temperature
        call leds.temperature(event.args[0],event.args[1])
    onevent V_leds_sound
        call leds.sound(event.args[0])
    
    ##! SOUND THYMIO EVENTS
    onevent A_sound_freq
        call sound.freq(event.args[0],event.args[1])
    onevent A_sound_play
        call sound.play(event.args[0])
    onevent A_sound_system
        call sound.system(event.args[0])
    onevent A_sound_replay
        call sound.replay(event.args[0])
    onevent A_sound_record
        call sound.record(event.args[0])
    
    ##! MOTOR THYMIO EVENTS
    onevent M_motor_both 
        motor.left.target = event.args[0]
        motor.right.target = event.args[1] 
    onevent M_motor_left
        motor.left.target = event.args[0]
    onevent M_motor_right
        motor.right.target = event.args[0] 

    ##! THYMIO UPDATE REPORTERS ##########################################

    ##! 20 Hz THYMIO REPORTER
    onevent buttons
        call math.dot(distance.front, prox.horizontal,[13,26,39,26,13,0,0],11)
        call math.clamp(distance.front,190-distance.front,0,190) # client should clamp to 0..190
        call math.max(distance.back, prox.horizontal[5],prox.horizontal[6])
        call math.muldiv(distance.back, distance.back, 267,10000)
        call math.clamp(distance.back,125-distance.back,0,125) # client should clamp to 0..125
        call math.dot(angle.front, prox.horizontal,[4,3,0,-3,-4,0,0],9)
        call math.dot(angle.back, prox.horizontal,[0,0,0,0,0,-4,4],9)
        call math.dot(angle.ground, prox.ground.delta,[4,-4],7)
        R_state[0] = ((((acc[0]/2)+16)%32)<<10) + ((((acc[1]/2)+16)%32)<<5) + (((acc[2]/2)+16)%32)
        R_state[1] = (((mic.intensity/12)%8)<<8) +(0<<5) +(button.backward<<4) +(button.center<<3) +(button.forward<<2) +(button.left<<1) +button.right
        R_state[2] = ((angle.ground+90) << 8) + (angle.back+90)
        R_state[3] = angle.front
        R_state[4] = (distance.back<<8) + distance.front
        R_state[5] = motor.left.target
        R_state[6] = motor.right.target
        R_state[7] = motor.left.speed
        R_state[8] = motor.right.speed
        R_state[9] = odo.degree
        R_state[10] = odo.x
        R_state[11] = odo.y
        R_state[12] = prox.comm.rx
        R_state[13] = prox.comm.tx
        R_state[14] = prox.ground.delta[0]
        R_state[15] = prox.ground.delta[1]
        R_state[16] = prox.horizontal[0]
        R_state[17] = prox.horizontal[1]
        R_state[18] = prox.horizontal[2]
        R_state[19] = prox.horizontal[3]
        R_state[20] = prox.horizontal[4]
        R_state[21] = prox.horizontal[5]
        R_state[22] = prox.horizontal[6]
        R_state[23] = Qid[0]
        R_state[24] = Qid[1]
        R_state[25] = Qid[2]
        R_state[26] = Qid[3]
        
    ##! 10 Hz THYMIO BROADCAST STATE
    onevent prox
    if R_state.do==1 then
        emit R_state_update(R_state)
    end
 
    
    onevent motor # loop runs at 100 Hz
        odo.delta = (motor.right.target + motor.left.target) / 2
        call math.muldiv(tmp[0], (motor.right.target - motor.left.target), 3406, 10000)
        odo.theta += tmp[0]
        call math.cos(tmp[0:1],[odo.theta,16384-odo.theta])
        call math.muldiv(tmp[0:1], [odo.delta,odo.delta],tmp[0:1], [32767,32767])
        odo.x += tmp[0]/45
        odo.y += tmp[1]/45
        odo.degree = 90 - (odo.theta / 182)
        if Qtime[Qpc] > 0 then
	        # start new motion
	        emit Q_motion_started([Qid[Qpc], Qtime[Qpc], QspL[Qpc], QspR[Qpc], Qpc])
	        Qtime[Qpc] = 0 - Qtime[Qpc] # mark as current by setting negative value
        end
        if Qtime[Qpc] < 0 then
	        # continue motion
	        motor.left.target = QspL[Qpc]
	        motor.right.target = QspR[Qpc]
	        Qtime[Qpc] += 1
	        if Qtime[Qpc] == 0 then
		        emit Q_motion_ended([Qid[Qpc], Qtime[Qpc], QspL[Qpc], QspR[Qpc], Qpc])
		        Qid[Qpc] = 0
		        Qpc = (Qpc+1)%QUEUE
		        if Qtime[Qpc] == 0 and Qpc == Qnx then
			        emit Q_motion_noneleft([Qpc])
			        motor.left.target = 0
			        motor.right.target = 0
		        end
	        end
        end
        if Qtime[Qpc] == 0 and Qpc != Qnx then
	        # scan forward in the queue
	        Qpc = (Qpc+1)%QUEUE
        end
        call math.fill(tmp,0)
        tmp[Qnx]=1
        tmp[Qpc]=4
        call leds.buttons(tmp[0],tmp[1],tmp[2],tmp[3])

    sub motion_add
        if (Qnx != Qpc or (Qnx == Qpc and Qtime[Qpc] == 0)) and Qid[0]!=tmp[0] and Qid[1]!=tmp[0] and Qid[2]!=tmp[0] and Qid[3]!=tmp[0] then
            Qid[Qnx]   = tmp[0]
            Qtime[Qnx] = tmp[1]
            QspL[Qnx]  = tmp[2]
            QspR[Qnx]  = tmp[3]
            emit Q_motion_added([Qid[Qnx], Qtime[Qnx], QspL[Qnx], QspR[Qnx], Qnx])
            Qnx = (Qnx+1)%QUEUE
        # else silently ignore
        end
        
    sub motion_cancel
    for tmp[1] in 1:QUEUE do
        if Qid[tmp[1]-1] == tmp[0] then
            emit Q_motion_cancelled([Qid[tmp[1]-1], Qtime[tmp[1]-1], QspL[tmp[1]-1], QspR[tmp[1]-1], tmp[1]-1])
            Qtime[tmp[1]-1] = -1 # on next motor trigger Q_motion_ended, Q_motion_noneleft
            # Qid[tmp[1]-1] = 0  # keep for Q_motion_ended, will be removed line 66
        end
    end

    onevent Q_add_motion
        tmp[0:3] = event.args[0:3]
        callsub motion_add

    onevent Q_cancel_motion
        tmp[0] = event.args[0]
        callsub motion_cancel

    ##! Set the odometer
    onevent Q_set_odometer
        odo.theta = (((event.args[0] + 360) % 360) - 90) * 182
        odo.x = event.args[1] * 28
        odo.y = event.args[2] * 28

    ##! Reset the queue and stop motors
    onevent Q_reset
        call math.fill(Qid,0)
        call math.fill(Qtime,0)
        call math.fill(QspL,0)
        call math.fill(QspR,0)
        call math.fill(Qpc,0)
        call math.fill(Qnx,0)
        motor.left.target = 0
        motor.right.target = 0
        emit Q_motion_noneleft([Qpc])
    
    `);

    thymioPrograms.push(`
    var rgb[3]
    # reusable temp for event handlers
    var tmp[9]
    var i = 0

    var R_state.do = 1 ##! flag for R_state broadcast
    var R_state[27] ##! [out] compressed robot state

    ##! THYMIO UPDATE REPORTERS ##########################################

    ##! 20 Hz THYMIO REPORTER
    onevent buttons
        R_state[0] = acc[0]
        R_state[1] = acc[1]
        R_state[2] = acc[2]
        R_state[3] = mic.intensity/12
        R_state[4] = button.backward
        R_state[5] = button.center
        R_state[6] = button.forward
        R_state[7] = button.left
        R_state[8] = button.right
        R_state[9] = motor.left.target
        R_state[10] = motor.right.target
        R_state[11] = motor.left.speed
        R_state[12] = motor.right.speed
        R_state[13] = prox.comm.rx
        R_state[14] = prox.comm.tx
        R_state[15] = prox.ground.delta[0]
        R_state[16] = prox.ground.delta[1]
        R_state[17] = prox.horizontal[0]
        R_state[18] = prox.horizontal[1]
        R_state[19] = prox.horizontal[2]
        R_state[20] = prox.horizontal[3]
        R_state[21] = prox.horizontal[4]
        R_state[22] = prox.horizontal[5]
        R_state[23] = prox.horizontal[6]
        R_state[24] = 0
        R_state[25] = 0
        R_state[26] = 0
        
    ##! 10 Hz THYMIO BROADCAST STATE
    onevent prox
    if R_state.do==1 then
        emit R_state_update(R_state)
    end


    ##! THYMIO INTERNAL EVENTS ##########################################

    ##! PING THYMIO EVENTS
    onevent ping
        call math.rand(rgb)
        for i in 0:2 do
            rgb[i] = abs rgb[i]
            rgb[i] = rgb[i] % 20
        end
        call leds.top(rgb[0], rgb[1], rgb[2])
        i++
        emit pong i  

    ##! LED THYMIO EVENTS
    onevent V_leds_prox_h
        call leds.prox.h(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
    onevent V_leds_circle
        call leds.circle(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
     onevent V_leds_top
        call leds.top(event.args[0],event.args[1],event.args[2])
    onevent V_leds_bottom_left
        call leds.bottom.left(event.args[0],event.args[1],event.args[2])
    onevent V_leds_bottom_right
        call leds.bottom.right(event.args[0],event.args[1],event.args[2])
    onevent V_leds_prox_v
        call leds.prox.v(event.args[0],event.args[1])
    onevent V_leds_buttons
        call leds.buttons(event.args[0],event.args[1],
                          event.args[2],event.args[3])    
    onevent V_leds_rc
        call leds.rc(event.args[0])   
    onevent V_leds_temperature
        call leds.temperature(event.args[0],event.args[1])
    onevent V_leds_sound
        call leds.sound(event.args[0])
    
    ##! SOUND THYMIO EVENTS
    onevent A_sound_freq
        call sound.freq(event.args[0],event.args[1])
    onevent A_sound_play
        call sound.play(event.args[0])
    onevent A_sound_system
        call sound.system(event.args[0])
    onevent A_sound_replay
        call sound.replay(event.args[0])
    onevent A_sound_record
        call sound.record(event.args[0])
    
    ##! MOTOR THYMIO EVENTS
    onevent M_motor_both 
        motor.left.target = event.args[0]
        motor.right.target = event.args[1] 
    onevent M_motor_left
        motor.left.target = event.args[0]
    onevent M_motor_right
        motor.right.target = event.args[0] 

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
        allNodes = nodes;
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

