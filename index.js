process.title = require('./package.json').name;

var forever = require('forever-monitor'),
    path = require('path');

var config = require('./config');

var child = new (forever.Monitor)(path.join('server', 'cluster.js'), {
  silent: false,
  uid: process.title,
  pidFile: 'server.pid',
  max: 10,
  options: process.argv.slice(2),
  sourceDir: __dirname,
  watch: true,
  watchIgnoreDotFiles: true,
  watchIgnorePatterns: [
    'client/**/*',
    'logs/**/*',
    'README*',
  ],
  watchDirectory: __dirname,
  env: process.env,
  cwd: process.cwd(),
  logFile: path.join('logs', 'log.log'),
  outFile: path.join('logs', 'out.log'),
  errFile: path.join('logs', 'err.log')
});

child.on('exit', function () {
  console.log(process.title + ': has exited after too many restarts.');
});

child.on('exit:code', function(code) {
  console.error(process.title + ': detected script exited with code ' + code + '.');
});

child.on('watch:restart', function(info) {
  console.error(process.title + ': restarted because ' + info.file + ' changed.');
});

child.on('restart', function() {
  console.error(process.title + ': restarted script for ' + child.times + ' time.');
});

child.start();
