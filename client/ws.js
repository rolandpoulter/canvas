'use strict';
/*global window, app, SockJS, WebSocketMultiplex*/

var ws = new SockJS(window.location.origin + '/ws', null, {
  debug: true,
  devel: true
});

module.exports = exports = ws;

app.io = ws;
app.ws = ws;

ws.ch = new WebSocketMultiplex(ws);

var timeout = setTimeout(refresh, 5000);

ws.onopen = function () {
  clearTimeout(timeout);
};

ws.onmessage = function (event) {
  if (event.data === 'refresh') refresh();
};

ws.onclose = function (event) {
  if (!event.wasClean) refresh(7000);
};

function refresh(duration) {
  setTimeout(
    window.location.reload.bind(window.location),
    duration || 500);
}

exports.entity = require('./io/entity.js');
exports.identifier = require('./io/identifier.js');
exports.session = require('./io/session.js');
