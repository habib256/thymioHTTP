############################
# ThymioHTTP Python 3 API  #
############################
# Vous aurez besoin d'installer pour Python3 :
# requests avec : "pip3 install requests" et 
# pygal avec : "pip3 install pygal CairoSVG tinycss cssselect"
#
# APACHE 2.0 License - CARRIE Nathalie et VERHILLE Arnaud

import json
import time
import requests
from pygal import XY


# URL du driver javascript ThymioHTTP
nodeurl = "http://127.0.0.1:3000/nodes"

################################################################
# Fonctions pour accéder à l'interface HTTP REST de ThymioHTTP #
################################################################

def runCode(code):
    url = nodeurl + "/code" + "/" + str(code)
    r = requests.put(url)
    time.sleep(0.05)

def lireCapteurs():
    # Affiche les valeurs des capteurs du Thymio
    #   thymioCapteurs[0] = acc[0]
    #   thymioCapteurs[1] = acc[1]
    #   thymioCapteurs[2] = acc[2]
    #   thymioCapteurs[3] = mic.intensity
    #   thymioCapteurs[4] = button.backward
    #   thymioCapteurs[5] = button.center
    #   thymioCapteurs[6] = button.forward
    #   thymioCapteurs[7] = button.left
    #   thymioCapteurs[8] = button.right
    #   thymioCapteurs[9] = motor.left.target
    #   thymioCapteurs[10] = motor.right.target
    #   thymioCapteurs[11] = motor.left.speed
    #   thymioCapteurs[12] = motor.right.speed
    #   thymioCapteurs[13] = prox.comm.rx
    #   thymioCapteurs[14] = prox.comm.tx
    #   thymioCapteurs[15] = prox.ground.delta[0]
    #   thymioCapteurs[16] = prox.ground.delta[1]
    #   thymioCapteurs[17] = prox.horizontal[0]
    #   thymioCapteurs[18] = prox.horizontal[1]
    #   thymioCapteurs[19] = prox.horizontal[2]
    #   thymioCapteurs[20] = prox.horizontal[3]
    #   thymioCapteurs[21] = prox.horizontal[4]
    #   thymioCapteurs[22] = prox.horizontal[5]
    #   thymioCapteurs[23] = prox.horizontal[6]
    #   thymioCapteurs[24] = temperature
    #   thymioCapteurs[25] = motorbusy

    response = requests.get (nodeurl+"/")
    response = response.json()
    thymioCapteurs = response
    return thymioCapteurs

def avance(vitesse):
    url = nodeurl + "/M_motor_both" + "/" + str(vitesse) + "/" + str(vitesse)
    r = requests.put(url)
    time.sleep(0.05)

def moteurs(vg,vd):
    url = nodeurl + "/M_motor_both" + "/" + str(vg) + "/" + str(vd)
    r = requests.put(url)
    time.sleep(0.05)

def stop():
    url = nodeurl + "/M_motor_both/0/0"
    r = requests.put(url)
    time.sleep(0.05)

def ping():
    url = nodeurl + "/ping"
    r = requests.put(url)
    time.sleep(0.05)

##################################################
# Exemples de programmes pour thymio en Python 3 #
##################################################

def danse1():
    repetition = 4
    compteur = 0
    while (compteur < repetition) :
        avance (300)
        time.sleep(2)
        ping()
        moteurs(200,-200)
        time.sleep(1.2)
        ping()
        compteur+=1 
    stop ()

def suiviDeLigne1():
    while (True) :
        capteurs = lireCapteurs()
        
        #thymioCapteurs[16] = prox.ground.delta[1]
        if capteurs[16] > 400 :
            moteurs(30,100)
        else :
            #thymioCapteurs[15] = prox.ground.delta[0]
            if capteurs[15] > 400 :
                moteurs(100,30)
            else :
                moteurs(100,100)

def drawGraph():
    xy = XY(stroke=False)
    xy.title = 'Correlation'
    xy.add('A', [(0, 0), (.1, .2), (.3, .1), (.5, 1), (.8, .6), (1, 1.08), (1.3, 1.1), (2, 3.23), (2.43, 2)])
    xy.add('B', [(.1, .15), (.12, .23), (.4, .3), (.6, .4), (.21, .21), (.5, .3), (.6, .8), (.7, .8)])
    xy.add('C', [(.05, .01), (.13, .02), (1.5, 1.7), (1.52, 1.6), (1.8, 1.63), (1.5, 1.82), (1.7, 1.23), (2.1, 2.23), (2.3, 1.98)])  
    xy.render_to_png('mygraph.png')
    xy.render_in_browser()

#############################################
# Programme principal du thymio en Python 3 #
#############################################

capteurs = lireCapteurs()      
print (capteurs)

#drawGraph()

suiviDeLigne1()
