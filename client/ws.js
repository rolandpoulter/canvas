'use strict';
/*global window, app, SockJS, WebSocketMultiplex*/

var ws = new SockJS(window.location.origin + '/ws', null, {
  debug: true,
  devel: true
});

module.exports = exports = ws;

app.ws = ws;

ws.ch = new WebSocketMultiplex(ws);

// ws.onopen = function () {
  // console.log('ws connection opened.');
// };

// ws.onmessage = function (event) {
  // console.log('ws received a message', event);
// };

// ws.onclose = function () {
  // console.log('ws connection closed.');
// };

exports.entity = require('./io/entity.js');
exports.session = require('./io/session.js');
exports.user = require('./io/view.js');
exports.wall = require('./io/wall.js');
