'use strict';

exports.compile = compileLess;

global.config = global.config || require('../config');

var path = require('path'),
    gulp = require('gulp'),
    less = require('gulp-less');

if (!module.parent) main();

else try {
    require('gulp').task('compile_less', main);
  } catch (err) {}

function main() {
  process.on('uncaughtException', error);
  try { return compileLess(); } catch (err) { error(err); }
}

function error(err) {
  console.error(err.stack || err);
  process.nextTick(process.exit);
}

function compileLess() {
  gulp.src('./client/css/*.less')
    .pipe(less({
      paths: [
        path.join(__dirname, '..', 'node_modules', 'bootstrap', 'less')
      ]
    }))
    .pipe(gulp.dest('./static/css'));
}
