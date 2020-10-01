############################
# ThymioHTTP Python 3 API  #
############################
# Vous aurez besoin d'installer request avec : "pip install requests"
# MIT License - VERHILLE Arnaud

import json
import time
import requests

# URL du javascript ThymioHTTP
nodeurl = "http://127.0.0.1:3000/nodes"

################################################################
# Fonctions pour accéder à l'interface HTTP REST de ThymioHTTP #
################################################################

def lireCapteurs():
    # Affiche les valeurs des capteurs du Thymio
    response = requests.get (nodeurl+"/")
    response = response.json()
    thymioCapteurs = response[0][1]
    return thymioCapteurs

def avance(vitesse):
    url = nodeurl + "/M_motor_both" + "/" + str(vitesse) + "/" + str(vitesse)
    r = requests.put(url)

def moteurs(vg,vd):
    url = nodeurl + "/M_motor_both" + "/" + str(vg) + "/" + str(vd)
    r = requests.put(url)

def stop():
    url = nodeurl + "/M_motor_both/0/0"
    r = requests.put(url)

def ping():
    url = nodeurl + "/ping"
    r = requests.put(url)

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
        time.sleep(0.1)
        
        #R_state[16] = prox.ground.delta[1]
        if capteurs[16] > 400 :
            moteurs(40,200)
            time.sleep(0.1)
        else :
            #R_state[15] = prox.ground.delta[0]
            if capteurs[15] > 400 :
                moteurs(200,40)
                time.sleep(0.1)
            else :
                moteurs(100,100)
                time.sleep(0.1)


#############################################
# Programme principal du thymio en Python 3 #
#############################################

suiviDeLigne1()