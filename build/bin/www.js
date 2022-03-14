#!/usr/bin/env node

/* eslint-disable import/extensions */

/* eslint-disable require-jsdoc */

/**
 * Module dependencies.
 */
"use strict";

var _http = require("http");

var _app = _interopRequireDefault(require("../app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Get port from environment and store in Express.
 */


const port = normalizePort(process.env.PORT || '4000');

_app.default.set('port', port);
/**
 * Event listener for HTTP server "error" event.
 */


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`; // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw error;
  }
}
/**
 * Create HTTP server.
 */


const server = (0, _http.createServer)(_app.default);
/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.info(`Listening on ${bind}`);
}
/**
 * Listen on provided port, on all network interfaces.
 */


server.listen(port);
server.on('error', onError);
server.on('listening', onListening); // ngrok.connect(port, {
//   authtoken: '23XjxggIrwwI2X3ohrGG3oQeEjj_69JHqsTj5Rcptt2Fwup3V'
// }).then((url) => {
//   console.log(`ngrok url: ${url}`);
// });