// ThymioHTTP via Javascript for Thymio Suite 2.X
// APACHE 2.0 License - VERHILLE Arnaud

import { createClient, Node, NodeStatus, Request, setup } from '@mobsya-association/thymio-api'

//Connect to the Thymio Suite
//We will need some way to get that url
let client = createClient("ws://localhost:8597");

// The Full List of all working Thymio(s) nodes
let myNodes = [];

let thymioPrograms = [];

var socket = io.connect('ws://localhost:3000');

// CODE Upload Events
socket.on('code', thymioCode);
async function thymioCode(data) {
    var s_obj = new String(data);
    console.log("Upload Program",s_obj)

    for (let node of myNodes) {
        await node.sendAsebaProgram(s_obj)
        await node.runProgram();
    }
}

// PING Events
socket.on('ping', thymioPing);
async function thymioPing(data) {
    console.log('Ping to all myNodes: ', myNodes);
    for (let node of myNodes) {
        await node.emitEvents({ "ping": null });
    }
}

// B_behavior Events
socket.on('B_behavior', thymioB_behavior);
async function thymioB_behavior(data) {
    //console.log('B_behavior');
    for (let node of myNodes) {
        await node.emitEvents({ "B_behavior": data });
    }
}

// ODOMETER Events
socket.on('Q_set_odometer', thymioQ_set_odometer);
async function thymioQ_set_odometer(data) {
    //console.log('Q_set_odometer');
    for (let node of myNodes) {
        await node.emitEvents({ "Q_set_odometer": data });
    }
}

//LEDs Events from Socket.io to Thymio
socket.on('V_leds_prox_h', thymioV_leds_prox_h);
async function thymioV_leds_prox_h(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_prox_h": data });
    }
}
socket.on('V_leds_circle', thymioV_leds_circle);
async function thymioV_leds_circle(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_circle": data });
    }
}
socket.on('V_leds_top', thymioV_leds_top);
async function thymioV_leds_top(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_top": data });
    }
}
socket.on('V_leds_bottom_left', thymioV_leds_bottom_left);
async function thymioV_leds_bottom_left(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_bottom_left": data });
    }
}
socket.on('V_leds_bottom_right', thymioV_leds_bottom_right);
async function thymioV_leds_bottom_right(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_bottom_right": data });
    }
}
socket.on('V_leds_prox_v', thymioV_leds_prox_v);
async function thymioV_leds_prox_v(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_prox_v": data });
    }
}
socket.on('V_leds_buttons', thymioV_leds_buttons);
async function thymioV_leds_buttons(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_buttons": data });
    }
}
socket.on('V_leds_rc', thymioV_leds_rc);
async function thymioV_leds_rc(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_rc": data });
    }
}
socket.on('V_leds_temperature', thymioV_leds_temperature);
async function thymioV_leds_temperature(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_temperature": data });
    }
}
socket.on('V_leds_sound', thymioV_leds_sound);
async function thymioV_leds_sound(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "V_leds_sound": data });
    }
}

// Sound Events from Socket.io to Thymio
socket.on('A_sound_system', thymioA_sound_system);
async function thymioA_sound_system(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "A_sound_system": data });
    }
}
socket.on('A_sound_freq', thymioA_sound_freq);
async function thymioA_sound_freq(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "A_sound_freq": data });
    }
}
socket.on('A_sound_play', thymioA_sound_play);
async function thymioA_sound_play(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "A_sound_play": data });
    }
}
socket.on('A_sound_record', thymioA_sound_record);
async function thymioA_sound_record(data) {
    await node.emitEvents({ "A_sound_record": data });
}
socket.on('A_sound_replay', thymioA_sound_replay);
async function thymioA_sound_replay(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "A_sound_replay": data });
    }
}

// Motors Events from Socket.io to Thymio
socket.on('M_motor_both', thymioM_motor_both);
async function thymioM_motor_both(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "M_motor_both": data });
    }
}
socket.on('M_motor_left', thymioM_motor_left);
async function thymioM_motor_left(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "M_motor_left": data });
    }
}
socket.on('M_motor_right', thymioM_motor_right);
async function thymioM_motor_right(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "M_motor_right": data });
    }
}

socket.on('M_motor_timed', thymioM_motor_timed);
async function thymioM_motor_timed(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "M_motor_timed": data });
    }
}

socket.on('Q_reset', thymioQ_reset);
async function thymioQ_reset(data) {
    for (let node of myNodes) {
        await node.emitEvents({ "Q_reset": null });
    }
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
        //socket.emit('thymio', data);
    } catch (e) {
        console.log(e);
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

                //Monitor events
                node.onEvents = async (events) => {
                    //console.log("events", events)
                    // Mainly R_state_update Broadcast to socket.io
                    socket.emit('thymio', events);
                    let { pong: pong } = events;
                    if (pong) {
                    }
                }


                // Thymio Events List 
                // Need to be updated if you want to create new events in aseba code
                await node.group.setEventsDescriptions([
                    { name: "ping", fixed_size: 0 },
                    { name: "pong", fixed_size: 1 },

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

                    { name: "Q_add_motion", fixed_size: 4 },
                    { name: "Q_cancel_motion", fixed_size: 1 },
                    { name: "Q_motion_added", fixed_size: 5 },
                    { name: "Q_motion_cancelled", fixed_size: 5 },
                    { name: "Q_motion_started", fixed_size: 5 },
                    { name: "Q_motion_ended", fixed_size: 5 },
                    { name: "Q_motion_noneleft", fixed_size: 1 },

                    { name: "B_behavior", fixed_size: 1 },

                    { name: "M_motor_timed", fixed_size: 3 },

                    { name: "R_state_update", fixed_size: 29 },
                    { name: "Q_set_odometer", fixed_size: 3 },
                    { name: "Q_reset", fixed_size: 0 }

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

        console.log(e)
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
    ##! Arnaud Verhille - gist974arobasegmailpointcom
    ##!
    ##! This AESL program defines high-level behaviors for the Thymio-II robot that enable
    ##! it to cooperate with programs like
    ##! Snap! with Nodejs and thymioHTTP REST API

    var R_state[29]          ##! [out] Robot FULL State

    var chronometer = 0      ##! BUSY Motors counter
    var busy = 0             ##! LOGO Motor Stuff
    var behavior = 0         ##! High Level Stuff
    
    var odometer = 0         ##! Odometer calculation
    var odo.delta            ##! [out] @private instantaneous speed difference
    var odo.theta = 0        ##! [out] odometer current angle
    var odo.x = 0            ##! [out] odometer x
    var odo.y = 0            ##! [out] odometer y
    var odo.degree           ##! [out] odometer direction

    # reusable temp vars for event handlers
    var tmp[9]
    var rgb[3]
    var i = 0

    # default value
    mic.threshold = 12

    ##! THYMIO UPDATE REPORTERS ##### 10Hz, 20 Hz, 100Hz ################
    ##! #################################################################   

    ##! 10 Hz THYMIO BROADCAST STATE
    onevent prox
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
        R_state[24] = temperature     

        if (behavior == 1) then
            callsub behavior1
        end
        if (behavior == 2) then
            callsub behavior2
        end

        emit R_state_update(R_state)

    ##! 20 Hz THYMIO
    onevent buttons
        R_state[4] = button.backward
        R_state[5] = button.center
        R_state[6] = button.forward
        R_state[7] = button.left
        R_state[8] = button.right
        R_state[0] = acc[0]
        R_state[1] = acc[1]
        R_state[2] = acc[2]
        R_state[3] = mic.intensity 
        R_state[9] = motor.left.target
        R_state[10] = motor.right.target
        R_state[11] = motor.left.speed
        R_state[12] = motor.right.speed
        R_state[25] = odo.degree
        R_state[26] = odo.x
        R_state[27] = odo.y
        R_state[28] = busy
           

    ##! 100 Hz THYMIO
    onevent motor # loop runs at 100 Hz
        if (odometer == 1) then
            odo.delta = (motor.right.target + motor.left.target) / 2
            call math.muldiv(tmp[0], (motor.right.target - motor.left.target), 3406, 10000)
            odo.theta += tmp[0]
            call math.cos(tmp[0:1],[odo.theta,16384-odo.theta])
            call math.muldiv(tmp[0:1], [odo.delta,odo.delta],tmp[0:1], [32767,32767])
            odo.x += tmp[0]/45
            odo.y += tmp[1]/45
            odo.degree = 90 - (odo.theta / 182)
        end

        if (busy == 1) then
            chronometer = chronometer - 1
            if (chronometer == 0) then
                motor.left.target = 0
                motor.right.target = 0
                busy = 0
            end
        end
                

    ##! THYMIO INTERNAL EVENTS ##########################################
    ##! #################################################################

    ##! PING THYMIO EVENTS
    onevent ping
        call math.rand(rgb)
        for i in 0:2 do
            rgb[i] = abs rgb[i]
            rgb[i] = rgb[i] % 20
        end
        call leds.top(rgb[0], rgb[1], rgb[2])
        i++
    ##!     emit pong i  

    ##! ODOMETER THYMIO EVENTS
    onevent Q_set_odometer
        odometer = 1
        odo.theta = (((event.args[0] + 360) % 360) - 90) * 182
        odo.x = event.args[1] * 28
        odo.y = event.args[2] * 28


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

    ##! SYNC LOGO MOTOR BUSY THYMIO ACTION STARTING EVENT
    onevent M_motor_timed
        behavior = 0
        busy = 1
        motor.left.target = event.args[0]
        motor.right.target = event.args[1]
        chronometer = event.args[2]

    ##! Reset the queue and stop motors
    onevent Q_reset
        chronometer = 0
        busy = 0
        behavior = 0  
        motor.left.target = 0
        motor.right.target = 0

    ##! THYMIO BEHAVIOR EVENTS

    onevent B_behavior
        behavior = event.args[0]

    ##! THYMIO BEHAVIORS SUBPROGRAMS
    ##! ############################################

    ##! Follow a black path very fast
    sub behavior1 
        if (prox.ground.delta[1] > 400) then
            motor.left.target = 100
            motor.right.target = 500
        elseif (prox.ground.delta[0] > 400) then
            motor.left.target = 500
            motor.right.target = 100
        else
            motor.left.target = 350
            motor.right.target = 350
        end

    ##! Follow a wall
    sub behavior2  
        when prox.horizontal[0] > 150 do
            motor.left.target = 200
            motor.right.target = -200	
        end
        when prox.horizontal[0] < 150 do
            motor.left.target = 250
            motor.right.target = 250
        end
        when prox.horizontal[4] > 150 do
            motor.left.target = -200
            motor.right.target = 200	
        end
        when prox.horizontal[4] < 150 do
            motor.left.target = 250
            motor.right.target = 250
        end

    `);


    // Thymio Comportement Explorateur
    thymioPrograms.push(`

    var temp
    var temp2
    var speed=200
    var vmin=-600
    var vmax=600

    var l[8]
    var led_state=0 
    var fixed
    var led_pulse

    timer.period[0]=20

    onevent buttons
    when button.forward==1 do #increase speed
        speed=speed+50
        if speed>500 then
            speed=500
        end
    end
    when button.backward==1 do #decrease speed
        speed=speed-50
        if speed <-300 then
            speed=-300
        end
    end

    onevent button.center	
    when button.center==1 do #stop robot
        speed=0
        motor.left.target=0
        motor.right.target=0
    end

    onevent timer0	
	    #Led ring animation
	    call math.fill(l, 0)
	    led_state = led_state + 2
	    if  led_state > 255 then
	    	led_state = 0
	    end
	    fixed = led_state /32
	    l[fixed] = 32
	    #l[(fixed - 1) < 0x7] = 32 - (led_state < 0x1F)
	    #l[(fixed + 1) < 0x7] = led_state < 0x1F
	    call leds.circle(l[0], l[1], l[2], l[3], l[4], l[5], l[6], l[7])

        #Body color pulse
	    led_pulse = led_pulse + 1
	    if led_pulse > 0 then
		    call leds.top(led_pulse, led_pulse, 0)
		    if led_pulse > 40 then
			    led_pulse = -64
		    end
	    else 
	    temp=-led_pulse/2
	    call leds.top(temp, temp, 0)
	    end


    onevent prox 
	    #Breintenberg obtacle avoidance
	    if speed >0 then
		    temp=(prox.horizontal[0]*1+prox.horizontal[1]*2+prox.horizontal[2]*3+prox.horizontal[3]*2+prox.horizontal[4]*1)
		    temp2=prox.horizontal[0]*-4+prox.horizontal[1]*-3+prox.horizontal[3]*3+prox.horizontal[4]*4
		    motor.left.target=speed-(temp+temp2)/(2000/speed)
		    motor.right.target=speed-(temp-temp2)/(2000/speed)
	    elseif speed < 0 then
		    temp=-300/speed
		    motor.left.target=speed+prox.horizontal[6]/temp
		    motor.right.target=speed+prox.horizontal[5]/temp
		    call math.min(motor.left.target, motor.left.target, vmax)
		    call math.max(motor.left.target, motor.left.target, vmin)
		    call math.min(motor.right.target, motor.right.target, vmax)
		    call math.max(motor.right.target, motor.right.target, vmin)
	    end
	    #Detecte table border 
	    if prox.ground.reflected[0]<130 or prox.ground.reflected[1]<130 then 
		    motor.left.target=0
		    motor.right.target=0
		    call leds.bottom.left(32,0,0)
		    call leds.bottom.right(32,0,0)
	    else
		    call leds.bottom.left(0,0,0)
		    call leds.bottom.right(0,0,0)
	    end
    `);
}


