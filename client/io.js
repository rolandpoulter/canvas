'use strict';
/*global window, app, SockJS, WebSocketMultiplex*/

app.ws = new SockJS(window.location.origin + '/ws');
app.ws.ch = new WebSocketMultiplex(app.ws);

require('bulk-require')(__dirname, ['io/*.js']);
