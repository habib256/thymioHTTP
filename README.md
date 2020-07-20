# thymioHTTP create an HTTP access to the thymio-device-manager 

2020-07-20 VERHILLE Arnaud

This is a javascript node-based application that provide a REST interface with introspection for Aseba devices like Thymio(s).

## Getting started

### Install Thymio Suite 2.x

https://www.thymio.org/fr/programmer/

### Install node and npm

Npm is a package manager for JavaScript, you will need it to work with the Thymio API

[Learn more here](https://docs.npmjs.com/getting-started/installing-node#install-npm--manage-npm-versions).

Note that despite depending on Node to install and build the Thymio JS API, it is fully compatible with browsers
and Node.

### Install the dependencies

Run `npm i` in the cloned directory to install the required dependencies.

### Launch the web app and rhe server

Run `npm run all`, then open `http://127.0.0.1:3000/` in your browser.
The web-based version outputs in the browser's console so hit Shift+Control+K to see the thymio api in action

Try `http://127.0.0.1:3000/nodes/` to see the thymio update data flow in json.

## Launch the Node-based application

Run `npm start`


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

## What next.

* [Thymio JS API
](https://github.com/Mobsya/thymio-js-api-demo.git)
* [Webpack](https://webpack.js.org/)
* [NPM](https://docs.npmjs.com/)
* [Babel](https://babeljs.io/)
