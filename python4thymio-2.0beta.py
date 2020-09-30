# ThymioHTTP Python 3 API
# Vous aurez besoin d'installer request avec : "pip install requests"
# MIT License - VERHILLE Arnaud

import json
import time
import requests

response = requests.get ("http://127.0.0.1:3000/nodes")

def avance(vitesse):
    url = "http://127.0.0.1:3000/nodes/M_motor_both" + "/" + str(vitesse) + "/" + str(vitesse)
    r = requests.put(url)
    print (url)

def moteurs(vg,vd):
    url = "http://127.0.0.1:3000/nodes/M_motor_both" + "/" + str(vg) + "/" + str(vd)
    r = requests.put(url)
    print (url)

def stop():
    url = "http://127.0.0.1:3000/nodes/M_motor_both/0/0"
    r = requests.put(url)
    print (url)

print ("Tableau de capteurs du Thymio :")
print (response.json())

# Programmer le thymio en Python

repetition = 10
compteur = 0

while (compteur < repetition) :
    avance (300)
    time.sleep(2)
    moteurs(200,-200)
    time.sleep(1.2)
    compteur+=1
    
stop ()
