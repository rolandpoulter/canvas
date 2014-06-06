'use strict';
/*global window, SockJS, WebSocketMultiplex*/

global.ws = new SockJS(window.location + '/ws');
global.ws.ch = new WebSocketMultiplex(ws);

require('bulk-require')(__dirname, ['io/*.js']);
