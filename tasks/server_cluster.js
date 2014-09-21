'use strict';

exports.create = startServerCluster;

global.config = global.config || require('../config');

var logger = console;

if (!module.parent) main();

else try {
    logger = require('gulp-util');
    require('gulp').task('server_cluster', main);
  } catch (err) {}

function main() {
  process.on('uncaughtException', error);
  try { return startServerCluster(); } catch (err) { error(err); }
}

function error(err) {
  logger.error(err.stack || err);
  process.nextTick(process.exit);
}

function startServerCluster(config) {
  /*jshint maxstatements:20*/

  config = config || global.config;

  var cluster = require('cluster'),
      numCPUs = require('os').cpus().length;

  if (cluster.isMaster) {
    cluster.setupMaster({
      exec: __dirname + require('path').sep + 'server_worker.js'
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
    console.error(process.title + ': is unable to reach a child worker.');
  }
}
