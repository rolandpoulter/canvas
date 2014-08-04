'use strict';
process.title = 'node' + require('../package.json').name + 'Master';

var cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

var config = require('../config');

if (cluster.isMaster) {
	cluster.setupMaster({
		exec: __dirname + require('path').sep + 'worker.js'
	});

  var threads = Math.min(numCPUs, config.webserver.cluster || 3),
      timeouts = [];

  for (var i = 0; i < threads; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log(
      process.title + ': child worker ' + worker.process.pid + ' died.',
      code, signal);
    clearTimeout(timeouts[worker.id]);
    cluster.fork();
  });

  cluster.on('fork', function (worker) {
    console.log(process.title + ': forked child ' + worker.process.pid + '.');
    timeouts[worker.id] = setTimeout(timeoutErrorMsg, 2000);
    timeouts[worker.id].unref();
  });

  cluster.on('listening', function (worker, address) {
    console.log(
      process.title + ': listening to child ' + worker.process.pid + '.',
      address.address + ':' + address.port);
    clearTimeout(timeouts[worker.id]);
  });
}

function timeoutErrorMsg() {
  console.error(process.title + ': is unable to reach a child worker.');
}
