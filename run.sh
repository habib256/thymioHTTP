#!/bin/sh

cd /opt/thymioHTTP

/var/lib/flatpak/app/org.mobsya.ThymioSuite/current/active/files/bin/thymio-device-manager  >/dev/null &

node thymiohttp.js & 

#chromium-browser 127.0.0.1:3000 "https://snap.berkeley.edu/snap/snap.html#present:Username=gist&ProjectName=snap4thymio-2.1&editMode&noRun"
#firefox 127.0.0.1:3000 "file:///opt/Snap/snap.html#run:http://127.0.0.1:3000/snaptoaseba.xml&editMode&noRun"

#chromium-browser  "file:///opt/Snap/snap.html#run:http://127.0.0.1:3000/snap4thymio.xml&editMode&noRun" 127.0.0.1:3000
google-chrome-stable  "file:///opt/Snap/snap.html#run:http://127.0.0.1:3000/snap4thymio.xml&editMode&noRun" 127.0.0.1:3000

