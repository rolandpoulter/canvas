'use strict';
/*global window, app, SockJS, WebSocketMultiplex*/

app.ws = new SockJS(window.location.origin + '/ws', null, {
  debug: true,
  devel: true
});

app.ws.ch = new WebSocketMultiplex(app.ws);

app.ws.onopen = function () {
  console.log('ws connection opened.');
};

app.ws.onmessage = function (event) {
  console.log('ws received a message', event);
};

app.ws.onclose = function () {
  console.log('ws connection closed.');
};

require('bulk-require')(__dirname, ['io/*.js']);
