# ThymioHTTP Python 3 API
###########################
# Vous aurez besoin d'installer request avec : "pip install requests"
# MIT License - VERHILLE Arnaud

import json
import time
import requests

# URL du javascript ThymioHTTP
nodeurl = "http://127.0.0.1:3000/nodes"

# Fonctions pour accéder à l'interface HTTP REST de ThymioHTTP
def avance(vitesse):
    url = nodeurl + "/M_motor_both" + "/" + str(vitesse) + "/" + str(vitesse)
    r = requests.put(url)
    print (url)

def moteurs(vg,vd):
    url = nodeurl + "/M_motor_both" + "/" + str(vg) + "/" + str(vd)
    r = requests.put(url)
    print (url)

def stop():
    url = nodeurl + "/M_motor_both/0/0"
    r = requests.put(url)
    print (url)

def ping():
    url = nodeurl + "/ping"
    r = requests.put(url)
    print (url)

#######################################
# Programmation du thymio en Python 3 #
#######################################

repetition = 10
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

# Affiche les valeurs des capteurs du Thymio
response = requests.get (nodeurl)
print ("Tableau de capteurs du Thymio :")
print (response.json())
