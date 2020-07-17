# thymioHTTP is based on thymio-js-api-demo

So this is a simple javascript node-based application that try to mimic the old obsolete asebahttp.

## Getting started

### Install aseba studio

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

Try `http://127.0.0.1:3000/node/` to see the thymio update data flow in json.

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

## What next.

You can copy this project or get inspiration from it to start working on web-applications compatible with thymio.

* [Thymio JS API](https://readthedocs.org/projects/aseba/)
* [Webpack](https://webpack.js.org/)
* [NPM](https://docs.npmjs.com/)
* [Babel](https://babeljs.io/)
