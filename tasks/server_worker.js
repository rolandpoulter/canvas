'use strict';

var cluster = require('cluster'),
    domain = require('domain'),
    gulp = require('gulp');
var App = require('./lib/App.js');

require('../config');
require('../logger.js');

exports.start = startServerWorker;

if (!module.parent) main();

else try {
  logger.useGulpUtilLogger();
  gulp.task('server_worker', main);
}

catch (err) {App.error(err);}

function main() {
  process.on('uncaughtException', App.error);

  try {
    process.title = 'node' + require('../package.json').name + 'Wkr';
    startServerWorker();
  }

  catch (err) {App.error(err);}
}

function startServerWorker() {
  var app = new App(domain.create()),
      run = app.run();

  app.domain.on('error', reset);
  app.domain.run(run);

  return reset;

  function reset(err) {
    if (err) return App.error(err);

    try {
      setTimeout(process.exit.bind(process, 1), 30000).unref();
      if (app.server) app.server.close();
      if (cluster.worker) cluster.worker.disconnect();
    }

    catch (err) {App.error(err);}
  }
}
