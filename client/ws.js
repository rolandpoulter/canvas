'use strict';
/*global window, app, SockJS, WebSocketMultiplex*/

var ws = new SockJS(window.location.origin + '/ws', null, {
  debug: true,
  devel: true
});

module.exports = exports = ws;

app.ws = ws;

ws.ch = new WebSocketMultiplex(ws);

var timeout = setTimeout(refresh, 5000);

ws.onopen = function () {
  console.log('ws connection opened.');

  clearTimeout(timeout);
};

ws.onmessage = function (event) {
  // console.log('ws received a message', event);

  if (event.data === 'refresh') refresh();
};

ws.onclose = function (event) {
  // console.log('ws connection closed.', event);

  if (!event.wasClean) refresh(7000);
};

function refresh(duration) {
  console.log('REFRESHING...');

  setTimeout(function () {
    window.location.reload();
  }, duration || 500);
}

exports.session = require('./io/session.js');

app.onceSessionReady(function () {
  exports.entity = require('./io/entity.js');
  exports.user = require('./io/view.js');
  exports.wall = require('./io/wall.js');
});
