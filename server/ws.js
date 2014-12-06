'use strict';

require('../config');
require('../logger.js');

var sockjs = require('sockjs'),
    MultiplexServer = require('websocket-multiplex').MultiplexServer;

app.ws = sockjs.createServer({
  sockjs_url: config.sockjs_url || 'http://cdn.sockjs.org/sockjs-0.3.min.js'
});

app.ws.ch = new MultiplexServer(app.ws);

if (config.debug) {
  app.ws.on('connection', function (app_stream) {
    logger.log('client websocket connection made.');

    app_stream.on('data', function (data) {
      logger.log('received io message:', data);
    });

    app_stream.on('close', function () {
      logger.log('client websocket connection closed.');
    });
  });
}

app.on('before_listen', function () {
  app.ws.installHandlers(app.server, {prefix: '/ws'});
});
