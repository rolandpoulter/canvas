'use strict';

var gulp = require('gulp');
var App = require('./lib/App.js');

exports.run = runApp;

require('../config');
require('../logger.js');

if (!module.parent) main();

else try {
  logger.useGulpUtilLogger();
  gulp.task('server', main);
}

catch (err) {App.error(err);}

function main() {
  process.on('uncaughtException', App.error);

  try {
    process.title = 'node' + config.package.name + 'App';
    return runApp();
  }

  catch (err) {App.error(err);}
}

function runApp() {
  return new App().run()();
}
