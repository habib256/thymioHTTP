# ThymioHTTP Python interface
# Vous aurez besoin d'installer request avec :
# "pip install requests"

import requests

response = requests.get ("http://127.0.0.1:3000/nodes")

print ("Tableau de capteurs du Thymio :")
print (response.json())

# Update an existing resource
requests.put('http://127.0.0.1:3000/nodes/ping', params = {'key':'value'})


options = {'left':'200','right':'200' }
r = requests.put('http://127.0.0.1:3000/nodes/M_motor_both', params = options )
print(r.url)
