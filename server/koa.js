'use strict';
process.title = 'node' + require('../package.json').name + 'App';

var koala = require('koala');

if (!module.parent) {
  exports = module.exports = createApp(require('../config'))
    .createServer()
    .setupServer(null, process.env.APP_ENTRY || null)
    .listen();
}

exports.create = createApp;

function createApp(config, domain) {
  /*jshint maxstatements:25, maxcomplexity:6*/
  var app = global.app || koala({});

  app.config = config || {};
  app.domain = domain || null;

  app.use(function* (next) {
    this.body = 'Hello World';
    yield next;
  });

  if (global.app) return global.app;

  global.app = app;

  app.events = new (require('events').EventEmitter)();

  app.createServer = function (_app_entry_path) {
    app.server = config.ssl ?
      require('https').createServer(config.ssl, app.callback()) :
      require('http').createServer(app.callback());
    var appRequire;
    if (_app_entry_path) {
      appRequire = require('enhanced-require')(module, {
        recursive: true,
        watch: true,
        hot: true
      });
      appRequire(_app_entry_path);
    }
    return app;
  };

  app.setupServer = function (web_server) {
    web_server = web_server || app.server;
    app.events.emit('setup_server', web_server);
    return app;
  };

  app.listen = function (web_server, server_config) {
    web_server = web_server || app.server;
    server_config = server_config || app.config.server;
    console.log('#' + process.pid + ' - ' +
      server_config.host + ':' + server_config.port);
    web_server.listen(server_config.port, server_config.host || '0.0.0.0');
    app.events.emit('listen_server', web_server);
    return app;
  };

  return app;
}
