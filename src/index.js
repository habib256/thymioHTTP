import { createClient, Node, NodeStatus, Request, setup } from '@mobsya-association/thymio-api'

//Connect to the Thymio Suite
//We will need some way to get that url
let client = createClient("ws://localhost:8597");
let selectedNode = undefined
let thymioPrograms = [];

var socket = io.connect('ws://localhost:3000');
socket.on('thymio', thymioUpdate);
socket.on('led', thymioLED);
socket.on('M_motor_both', thymioM_motor_both);
socket.on('stop', thymioStop);

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

function thymioUpdate(data) {
    //console.log(data);
    socket.emit('thymio', data);
}

async function thymioLED(data) {
    console.log('LED avec paramètre', data.led);
    await selectedNode.emitEvents({ "ping": null });
    //socket.emit('thymio', data);
}
async function thymioM_motor_both(data) {
    console.log('M_motor_both avec paramètre', data.speed);
    await selectedNode.emitEvents({ "M_motor_both": null });
}
async function thymioStop(data) {
    console.log('stop avec paramètre', data.stop);
    await selectedNode.emitEvents({ "stop": null });
    //socket.emit('thymio', data);
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
                    { name: "M_motor_both", fixed_size: 0 },
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
        motor.left.target = 200
        motor.right.target = 200 
    onevent stop
        motor.left.target = 0
        motor.right.target = 0
    `);

    thymioPrograms.push(`
    ##!
    ##! @file thymio_motion.aesl
    ##! @brief Basic motion queue for Thymio-II
    ##! @mainpage Basic motion queue for Thymio-II
    ##! David J Sherman - david.sherman@inria.fr
    ##!
    ##! This AESL program defines high-level behaviors for the Thymio-II robot that enable
    ##! it to cooperate with programs like
    ##! <a href="">Scratch</a>,
    ##! <a href="">Snap!</a>,
    ##! and <a href="">Nodejs</a>,
    ##! in particular using the <a href="">asebahttp REST API</a>.
    ##! The features defined here are:
    ##!
    ##! -# A motion queue of length 4 with a program counter (@ref Queue)
    ##! -# Incoming events to change queue: Q_add_motion, Q_cancel_motion, Q_reset (@ref Motion)
    ##! -# Broadcast of informative events when the motion queue changes state (@ref Queue and @ref Motion)
    ##! -# Odometry (angle, x, y), updated at 100Hz (@ref Odometry)
    ##! -# Incoming events for native functions: V_leds_*, A_sound_*, M_motor_* (@ref Native)
    ##! -# Variables for simplified reporters (distance and angle) from prox.* (@ref Reporters)
    ##! -# Broacast of compressed robot state at 10 Hz (@ref State)
    ##!
    ##! Events that can be used for broadcast on the Aseba bus are defined in @ref aesl_events.
    ##! Constants are defined in @ref aesl_constants.

    # reusable temp for event handlers
    var tmp[9]

    ##! @defgroup Queue
    ##! @brief A motion queue with program counter, used by @ref Motion and @ref Odometry
    ##!
    ##! Every 100 Hz tick from motion event, run the motion queue and update the odometry.
    ##! If the motion task at @c Qpc is active, turn the motors at the speeds @c QspL and @c QspR and
    ##! decrement the @c Qtime count. Otherwise, look for a next task to perform.
    ##! The active task is the @c Qid entry whose value is negative.
    ##! The button LEDs show the values of @c Qpc qnd @c Qnx.
    ##! The subroutines @c motion_add and @c motion cancel are called from the @c Q_* events in @ref Motion.
    ##! @{
    var Qid[QUEUE]   = [ 0,0,0,0 ] ##!< [out] task id
    var Qtime[QUEUE] = [ 0,0,0,0 ] ##!< [out] remaining time
    var QspL[QUEUE]  = [ 0,0,0,0 ] ##!< [out] motor speed L
    var QspR[QUEUE]  = [ 0,0,0,0 ] ##!< [out] motor speed R
    var Qpc = 0                    ##!< [out] program counter
    var Qnx = 0                    ##!< [out] next pc

    ##! @}

    ##! @defgroup Reporters
    ##! @brief Variables for simplified reporters (distance and angle).
    ##!
    ##! The individual sensor values reported by @c prox.* cannot be easily communicated using
    ##! the Scratch protocol. The simplified reporters defined here combine the sensors into various
    ##! useful values: distance from a single obstacle, angle from a single obstacle, in the front or
    ##! in the back. The @c angle.ground reporter compares the ground sensors and can be used for
    ##! line following. Under standard lighting conditions, the distances are very approximately in
    ##! millimeters and the angles are very approximately in degrees.
    ##! These reporters are updated at 20 Hz by the @c button event.
    ##! @{
    var distance.front = 190 ##!<  [out] distance front
    var distance.back  = 125 ##!<  [out] distance back
    var angle.front    = 0 ##!<  [out] angle front
    var angle.back     = 0 ##!<  [out] angle back
    var angle.ground   = 0 ##!<  [out] angle ground

    ##! @}

    ##! @defgroup Odometry
    ##! @brief Odometry (angle, x, y), updated at 100Hz
    ##!
    ##! A simple dead reckoning is calculed from the two motor target speeds @f$ M_R @f$ and @f$ M_L @f$.
    ##! Since we are updating at 100 Hz, the angles will be small and we can use the formulas from
    ##! <a href="http://www-personal.engin.umich.edu/~johannb/position.htm">(Borenstein et al 1996)</a>
    ##! as described by
    ##! <a href="http://rossum.sourceforge.net/papers/DiffSteer/DiffSteer.html#d6">(Lucas 2000)</a>:
    ##! @f[ \Delta = (M_R + M_L)/2 @f]
    ##! @f[ \theta \,+\!\!= k_1 (M_R - M_L)/b @f]
    ##! @f[ x \,+\!\!= k_2 \Delta \cos\theta @f]
    ##! @f[ y \,+\!\!= k_2 \Delta \sin\theta @f]
    ##! where @f$ b=95 @f$ mm is the wheelbase, and constants @f$ k_1=32.36 @f$, @f$ k_2=6.78\times10^{-7} @f$ scale to and from Aseba radians.
    ##! @{
    var odo.delta ##!< [out] @private instantaneous speed difference
    var odo.theta = 0 ##!< [out] odometer current angle
    var odo.x = 0 ##!< [out] odometer x
    var odo.y = 0 ##!< [out] odometer y
    var odo.degree ##!< [out] odometer direction

    ##! @}

    ##! @defgroup State
    ##! @brief Broadcast of compressed robot state at 10 Hz
    ##! @{
    ##!
    ##! The state of the robot's sensors, representing 36 words, is compressed into the 27 words of the @c R_state
    ##! variable as described below.
    ##! When @c R_state.do is nonzero, @c R_state is broadcast in an event of the same name (@c R_state) at 10 Hz by
    ##! the @c prox event. Otherwise, clients are expected to fetch @c R_state at a frequency of their choosing.
    ##! words | bits | value | words | bits | value
    ##! ----- | ---- | ----- | ----- | ---- | -----
    ##! 0 | 10-15 | @c acc[0]/2 + 16		  | 4     | 0-7 | @c distance.front
    ##! 0 | 5-9   | @c acc[1]/2 + 16		  | 5     |     | @c motor.left.target
    ##! 0 | 0-4   | @c acc[2]/2 + 16		  | 6     |     | @c motor.right.target
    ##! 1 | 8-15  | @c mic.intensity/@c mic.threshold | 7     |     | @c motor.left.speed
    ##! 1 | 5-7   | (reserved)                        | 8     |     | @c motor.right.speed
    ##! 1 | 4     | @c button.backward   		  | 9     |     | @c odo.degree
    ##! 1 | 3     | @c button.center     		  | 10    |     | @c odo.x
    ##! 1 | 2     | @c button.forward    		  | 11    |     | @c odo.y
    ##! 1 | 1     | @c button.left       		  | 12    |     | @c prox.comm.rx
    ##! 1 | 0     | @c button.right      		  | 13    |     | @c prox.comm.tx
    ##! 2 | 8-15  | @c angle.ground   		  | 14-15 |     | @c prox.ground.delta[0:1]
    ##! 2 | 0-7   | @c angle.back     		  | 16-22 |     | @c prox.horizontal[0:6]
    ##! 3 |       | @c angle.front                    | 23-26 |     | @c Qid[0:3]
    ##! 4 | 8-15  | @c distance.back                  |       |     | @c

    var R_state.do = 1 ##!< flag for R_state broadcast
    var R_state[27] ##!< [out] compressed robot state

    ##! @}

    # default value
    mic.threshold = 12

    ##! @addtogroup Queue
    ##! @{

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

##! @brief Subroutine to add a task to the queue
##! @private
##! @param Qid task id
##! @param Qtime time in 100ths
##! @param QspL left motor speed
##! @param QspR right motor speed
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

##! @brief Subroutine to cancel a task from the queue
##! @private
##! @param Qid task id
sub motion_cancel
for tmp[1] in 1:QUEUE do
	if Qid[tmp[1]-1] == tmp[0] then
		emit Q_motion_cancelled([Qid[tmp[1]-1], Qtime[tmp[1]-1], QspL[tmp[1]-1], QspR[tmp[1]-1], tmp[1]-1])
		Qtime[tmp[1]-1] = -1 # on next motor trigger Q_motion_ended, Q_motion_noneleft
		# Qid[tmp[1]-1] = 0  # keep for Q_motion_ended, will be removed line 66
	end
end

##! @}

##! @defgroup Motion
##! @brief Incoming events to change motion queue: @c Q_*
##!
##! The REST API provides events for sending requests to the motion queue.
##! Note that the brief description line for each will be used as the Scratch block definition.
##!
##! Changes to the motion queue will be broadcast using events @c Q_motion_added,
##! @c Q_motion_cancelled, @c Q_motion_started, @c Q_motion_ended, @c Q_motion_noneleft.
##! @{

##! Add a task to the motion queue
##! @brief Q_add_motion job \%n for \%n csec, left \%n right \%n
##! @param Qid task id
##! @param Qtime time in 100ths
##! @param QspL left motor speed
##! @param QspR right motor speed
onevent Q_add_motion
tmp[0:3] = event.args[0:3]
callsub motion_add

##! Cancel a task in the motion queue
##! @brief Q_cancel_motion job \%n
##! @param Qid task id
onevent Q_cancel_motion
tmp[0] = event.args[0]
callsub motion_cancel

##! Set the odometer
##! @brief Q_set_odometer theta \%n x \%n y \%n
##! @param angle angle in Aseba radians
##! @param x x coordinate
##! @param y y coordinate
onevent Q_set_odometer
odo.theta = (((event.args[0] + 360) % 360) - 90) * 182
odo.x = event.args[1] * 28
odo.y = event.args[2] * 28

##! Reset the queue and stop motors
##!  @brief Q_reset
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

##! @}

# update reporters at 20 Hz
onevent buttons
call math.dot(distance.front, prox.horizontal,[13,26,39,26,13,0,0],11)
call math.clamp(distance.front,190-distance.front,0,190) # client should clamp to 0..190
call math.max(distance.back, prox.horizontal[5],prox.horizontal[6])
call math.muldiv(distance.back, distance.back, 267,10000)
call math.clamp(distance.back,125-distance.back,0,125) # client should clamp to 0..125
call math.dot(angle.front, prox.horizontal,[4,3,0,-3,-4,0,0],9)
call math.dot(angle.back, prox.horizontal,[0,0,0,0,0,-4,4],9)
call math.dot(angle.ground, prox.ground.delta,[4,-4],7)
R_state = [	((((acc[0]/2)+16)%32)<<10) + ((((acc[1]/2)+16)%32)<<5) + (((acc[2]/2)+16)%32),
			(((mic.intensity/mic.threshold)%8)<<8) +
				(0<<5) +
				(button.backward<<4) +
				(button.center<<3) +
				(button.forward<<2) +
				(button.left<<1) +
				button.right,
			((angle.ground+90) << 8) + (angle.back+90),
			angle.front,
			(distance.back<<8) + distance.front,
			motor.left.target,
			motor.right.target,
			motor.left.speed,
			motor.right.speed,
			odo.degree,
			odo.x,
			odo.y,
			prox.comm.rx,
			prox.comm.tx,
			prox.ground.delta[0:1],
			prox.horizontal[0:6],
			Qid[0:3]
		  ]

# broadcast state at 10 Hz
onevent prox
if R_state.do==1 then
	emit R_state_update(R_state)
end

##! @defgroup Native
##! @brief Incoming events for native functions: @c V_leds_*, @c A_sound_*, @c M_motor_*
##!
##! The REST API exposes selected Aseba native functions by adding events for each of them.
##! Note that the brief description line for each will be used as the Scratch block definition.
##! @{

##! Light the bottom LEDs
##! @brief V_leds_bottom \%m.zeroone \%n \%n \%n
##! @param red red LED value 0..31
##! @param green green LED value 0..31
##! @param blue blue LED value 0..31
##! @param side left (0) or right (1)
onevent V_leds_bottom
if event.args[0]==0 then
	call leds.bottom.left(event.args[1],event.args[2],event.args[3])
else
	call leds.bottom.right(event.args[1],event.args[2],event.args[3])
end

##! Light the button LEDs
##! @brief V_leds_buttons \%n \%n \%n \%n
##! @param forward forward LED value 0..31
##! @param right right LED value 0..31
##! @param backward backward LED value 0..31
##! @param left left LED value 0..31
onevent V_leds_buttons
call leds.buttons(event.args[0],event.args[1],
                  event.args[2],event.args[3])

##! Light the circle LEDs
##! @brief V_leds_circle \%n \%n \%n \%n \%n \%n \%n \%n
##! @param t0000 0000 LED value 0..31
##! @param t0130 0130 LED value 0..31
##! @param t0300 0300 LED value 0..31
##! @param t0430 0430 LED value 0..31
##! @param t0600 0600 LED value 0..31
##! @param t0730 0730 LED value 0..31
##! @param t0900 0900 LED value 0..31
##! @param t1030 1030 LED value 0..31
onevent V_leds_circle
call leds.circle(event.args[0],event.args[1],event.args[2],
	             event.args[3],event.args[4],event.args[5],
	             event.args[6],event.args[7])

##! Light the proximity sensor LEDs
##! @brief V_leds_prox_h \%n \%n \%n \%n \%n \%n \%n \%n
##! @param fl front left 0..31
##! @param flm front left middle 0..31
##! @param flc front left center 0..31
##! @param frc front right center 0..31
##! @param frm front right middle 0..31
##! @param fr front right 0..31
##! @param br back right 0..31
##! @param bl back left 0..31
onevent V_leds_prox_h
call leds.prox.h(event.args[0],event.args[1],event.args[2],
	             event.args[3],event.args[4],event.args[5],
	             event.args[6],event.args[7])

##! Light the ground sensor LEDs
##! @brief V_leds_prox_v \%n \%n
##! @param left left ground sensor LED value 0..31
##! @param right right ground sensor LED value 0..31
onevent V_leds_prox_v
call leds.prox.v(event.args[0],event.args[1])

##! Light the RC sensor LED
##! @brief V_leds_rc \%n
##! @param value RC LED value 0..31
onevent V_leds_rc
call leds.rc(event.args[0])

##! Light the sound sensor LED
##! @brief V_leds_sound \%n
##! @param value sound LED value 0..31
onevent V_leds_sound
call leds.sound(event.args[0])

##! Light the temperature sensor LEDs
##! @brief V_leds_temperature hot \%n cold \%n
##! @param hot red LED value 0..31
##! @param cold blue LED value 0..31
onevent V_leds_temperature
call leds.temperature(event.args[0],event.args[1])

##! Light the top LEDs
##! @brief V_leds_top \%n \%n \%n
##! @param red red value 0..31
##! @param green green value 0..31
##! @param blue blue value 0..31
onevent V_leds_top
call leds.top(event.args[0],event.args[1],event.args[2])

##! Play a system sound
##! @brief A_sound_system \%n
##! @param sound system sound number
onevent A_sound_system
call sound.system(event.args[0])

##! Play a note (Hz) for a time (60ths)
##! @brief A_sound_freq \%n Hz \%n/60ths
##! @param freq freg in Hz
##! @param duration in 60ths
onevent A_sound_freq
call sound.freq(event.args[0],event.args[1])

##! Play a sound from the SD
##! @brief A_sound_play \%n
##! @param slot SD sound number
onevent A_sound_play
call sound.play(event.args[0])

##! Start or stop recording
##! @brief A_sound_record \%n
##! @param slot recorded sound number
onevent A_sound_record
call sound.record(event.args[0])

##! Play a recorded sound
##! @brief A_sound_replay \%n
##! @param slot recorded sound number
onevent A_sound_replay
call sound.replay(event.args[0])

##! Run the left motor
##! @brief M_motor_left \%n
##! @param speed
onevent M_motor_left
motor.left.target = event.args[0]

##! Run the right motor
##! @brief M_motor_right \%n
##! @param speed
onevent M_motor_right
motor.right.target = event.args[0]

##! @}
    `);
}