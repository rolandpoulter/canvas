'use strict';

exports.start = startServerWorker;

global.config = global.config || require('../config');

if (!module.parent) main();

else try {
    require('gulp').task('server_worker', main);
  } catch (err) {}

function main() {
  process.on('uncaughtException', error);
  try {
    process.title = 'node' + require('../package.json').name + 'Wkr';
    startServerWorker();
  } catch (err) { error(err); }
}

function error(err) {
  console.error(err.stack || err);
  process.nextTick(process.exit);
}

function startServerWorker(config) {
  config = config || global.config;

  var cluster = require('cluster');

  var domain = require('domain').create();
  var app = require('./server_app.js').load(config, domain);

  app.createServer(__dirname + '/../server/app.js');
  app.setupServer();

  domain.on('error', function (error) {
    console.error(error.stack || error);
    reset();
  });

  domain.run(function () {
    app.listen();
  });

  return reset;

  function reset() {
    try {
      setTimeout(process.exit.bind(process, 1), 30000).unref();
      if (app.server) app.server.close();
      if (cluster.worker) cluster.worker.disconnect();
    }
    catch (error) {
      console.error(error.stack || error);
      process.exit(1);
    }
  }
}
