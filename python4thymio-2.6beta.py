############################
# ThymioHTTP Python 3 API  #
############################
# Vous aurez besoin d'installer requests avec : "pip install requests"
# APACHE 2.0 License - CARRIE Nathalie et VERHILLE Arnaud

import json
import time
import requests

# URL du driver javascript ThymioHTTP
nodeurl = "http://127.0.0.1:3000/nodes"

################################################################
# Fonctions pour accéder à l'interface HTTP REST de ThymioHTTP #
################################################################

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
        print (capteurs)
        
        #thymioCapteurs[16] = prox.ground.delta[1]
        if capteurs[16] > 400 :
            moteurs(60,250)
        else :
            #thymioCapteurs[15] = prox.ground.delta[0]
            if capteurs[15] > 400 :
                moteurs(250,60)
            else :
                moteurs(250,250)

#############################################
# Programme principal du thymio en Python 3 #
#############################################

suiviDeLigne1()