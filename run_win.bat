rem AUTOSTART ThymioHTTP under Windows 

cd "C:\Program Files\Thymio\bin"
start /MIN thymio-device-manager

cd C:\Users\gistarcade\src\thymioHTTP
start /MIN node thymiohttp.js

C:\"Program Files\Mozilla Firefox\firefox.exe" "https://snap.berkeley.edu/snap/snap.html#present:Username=gist&ProjectName=basic_thymio_motion.aesl&editMode&noRun" 127.0.0.1:3000

rem C:\"Program Files (x86)\Google\Chrome\Application\chrome.exe" "https://snap.berkeley.edu/snap/snap.html#present:Username=gist&ProjectName=basic_thymio_motion.aesl&editMode&noRun" 127.0.0.1:3000

