'use strict';

exports.run = runApp;

exports.load = loadApp;

global.config = global.config || require('../config');

var path = require('path'),
    koala = require('koala'),
    logger = console;//require('../lib/logger.js');

if (!module.parent) main();

else try {
    logger = require('gulp-util');
    require('gulp').task('server', main);
  } catch (err) {}

function main() {
  process.on('uncaughtException', error);
  try {
    process.title = 'node' + require('../package.json').name + 'App';
    return runApp();
  } catch (err) { error(err); }
}

function error(err) {
  logger.error(err.stack || err);
  process.nextTick(process.exit);
}

function runApp(config) {
  config = config || global.config;

  return loadApp(config)
    .createServer(config.app_entry ||
                  path.join(__dirname, '..', 'server', 'app.js'))
    .setupServer()
    .listen();
}

function loadApp(config, domain) {
  /*jshint maxstatements:25, maxcomplexity:10*/

  config = config || global.config;

  var app = global.app || koala({
    fileServer: {
      root: config.static_root ||
            path.join(__dirname, '..', 'static'),
      index: true,
      hidden: true,
      maxage: config.static_max_age || '1 year'
    }
  });

  app.config = config || {};
  app.domain = domain || null;

  if (global.app) return global.app;

  global.app = app;

  app.events = new (require('events').EventEmitter)();

  app.createServer = function (_app_entry_path) {
    var appRequire;
    if (_app_entry_path) {
      if (!!config.hotCode) {
        require(_app_entry_path);
      }
      else {
        appRequire = require('enhanced-require')(module, {
          substitutions: {
            'jugglingdb-mongodb': require('jugglingdb-mongodb') // Hack
          },
          recursive: true,
          watch: true,
          hot: true
        });
        appRequire(_app_entry_path);
      }
    }
    app.events.emit('before_server_created');
    app.server = config.ssl ?
      require('https').createServer(config.ssl, app.callback()) :
      require('http').createServer(app.callback());
    app.events.emit('after_server_created', app.server);
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
    logger.log('#' + process.pid + ' - ' +
               server_config.host + ':' +
               server_config.port);
    web_server.listen(server_config.port,
                      server_config.host || '0.0.0.0');
    app.events.emit('server_listen', web_server);
    return app;
  };

  return app;
}
