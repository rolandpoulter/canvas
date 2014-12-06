'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var cluster = require('cluster'),
    gulp = require('gulp'),
    path = require('path'),
    os = require('os');
var App = require('./lib/App.js');

exports.create = startServerCluster;

require('../config');
require('../logger.js');

if (!module.parent) main();

else try {
  logger.useGulpUtilLogger();
  gulp.task('server_cluster', main);
}

catch (err) {App.error(err);}

function main() {
  process.on('uncaughtException', App.error);

  try {return startServerCluster();}

  catch (err) {App.error(err);}
}

function startServerCluster() {
  /*jshint maxstatements:20*/

  var numCPUs = os.cpus().length;

  if (cluster.isMaster) {
    cluster.setupMaster({
      exec: __dirname + path.sep + 'server_worker.js'
    });

    var threads = Math.min(numCPUs, config.server.cluster || 3),
        timeouts = [];

    for (var i = 0; i < threads; i++) {
      cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
      logger.log(process.title + ': child worker ' +
                 worker.process.pid + ' died.',
                 code, signal);

      clearTimeout(timeouts[worker.id]);
      cluster.fork();
    });

    cluster.on('fork', function (worker) {
      logger.log(process.title + ': forked child ' + worker.process.pid + '.');

      timeouts[worker.id] = setTimeout(timeoutErrorMsg, 2000);
      timeouts[worker.id].unref();
    });

    cluster.on('listening', function (worker, address) {
      logger.log(process.title + ': listening to child ' +
                 worker.process.pid + '.',
                 address.address + ':' + address.port);

      clearTimeout(timeouts[worker.id]);
    });
  }

  function timeoutErrorMsg() {
    logger.error(process.title + ': is unable to reach a child worker.');
  }
}
