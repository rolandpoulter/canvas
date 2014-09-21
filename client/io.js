'use strict';
/*global window, app, SockJS, WebSocketMultiplex*/

app.io = exports;

exports.ws = new SockJS(window.location.origin + '/ws', null, {
  debug: true,
  devel: true
});

exports.ws.ch = new WebSocketMultiplex(app.ws);

exports.ws.onopen = function () {
  console.log('ws connection opened.');
};

exports.ws.onmessage = function (event) {
  console.log('ws received a message', event);
};

exports.ws.onclose = function () {
  console.log('ws connection closed.');
};

exports.entity = require('./io/entity.js');
exports.session = require('./io/session.js');
exports.user = require('./io/user.js');
exports.wall = require('./io/wall.js');
