# thymioHTTP 

2020-07-20 VERHILLE Arnaud

The main goal of this project is to provide an access to the Thymio(s) from the [Berkeley Snap!](https://snap.berkeley.edu/), Scratch+++ like programming langage.
This is a javascript node-based application that create an ws:// access to the thymio-device-manager running under Thymio Suite 2.x and provide an HTTP REST simple API to control the Thymio(s).

![Screenshot](/Screenshot.png?raw=true "Screenshot")

## Getting started

### Install Thymio Suite 2.x

https://www.thymio.org/fr/programmer/

### Install node and npm

Npm is the package manager for JavaScript on Node.js , you will need it to work with the Thymio API

[Node.js](https://nodejs.org/en/).

Note that despite depending on Node to install and build the Thymio JS API, it is fully compatible with browsers
(Google chrome & Firefox) and Node on most operating systems (MacOS, Win$ or GNU/Linux).

### Install the dependencies

Run `npm i` in the cloned directory to install the required dependencies.

### Launch the web app and the server

Run `npm run all`, then open `http://127.0.0.1:3000/` in your browser.
The web-based version outputs in the browser's console so hit Shift+Control+K to see the thymio api in action

Open snap4thymio-2.0.xml file with Berkeley Snap!

## How does it work?

The thymio API is distributed as a [npm package](https://www.npmjs.com/package/@mobsya-association/thymio-api).
It can be installed with `npm -i @mobsya-association/thymio-api`.

This demo project also depends on:
* Webpack to orchestrate the bundling of the application for both node and browser
* Babel to convert the code in a flavor of Javascript compatible with older versions of web browsers
* Socket.io to talk with the include HTTP server

The code is in `src` and gets compiled into `dist`.

## HTTP REST API Access

- GET  /nodes                                 - JSON list of all known nodes
- GET  /nodes/:NODENAME                       - JSON attributes for :NODENAME
- PUT  /nodes/:NODENAME                       - write new Aesl program
- GET  /nodes/:NODENAME/:VARIABLE             - retrieve JSON value for :VARIABLE
- POST /nodes/:NODENAME/:VARIABLE             - send new values(s) for :VARIABLE
- POST /nodes/:NODENAME/:EVENT                - call an event :EVENT
- GET  /events\[/:EVENT\]*                      - create SSE stream for all known nodes
- GET  /nodes/:NODENAME/events\[/:EVENT\]*      - create SSE stream for :NODENAME

## Snap! DataSprite Librarie

![Screenshot](/Screenshot.png?raw=true "Screenshot")

## What next.

* [Thymio JS API
](https://github.com/Mobsya/thymio-js-api-demo.git)
* [Webpack](https://webpack.js.org/)
* [NPM](https://docs.npmjs.com/)
* [Babel](https://babeljs.io/)
