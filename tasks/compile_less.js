'use strict';

var gulp = require('gulp'),
    less = require('gulp-less');
var App = require('./lib/App.js');

exports.compile = compileLess;

require('../config');
require('../logger.js');

if (!module.parent) main();

else try {gulp.task('compile_less', main);}

catch (err) {}

function main() {
  process.on('uncaughtException', App.error);

  try {return compileLess();}

  catch (err) {App.error(err);}
}

function compileLess() {
  gulp.src(config.task.less_src)
    .pipe(less({paths: config.server.app.less_paths}))
    .pipe(gulp.dest(config.task.less_dest));
}
