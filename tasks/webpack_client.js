'use strict';

exports.build = buildWebpackClient;

exports.create = createWebpackClient;

require('../config');
require('../logger.js');

var gulp = require('gulp'),
    gulpWebpack = require('gulp-webpack'),
    webpack = require('webpack');

if (!module.parent) {
  webpack = gulpWebpack;
  main();
}

else try {
  logger.useGulpUtilLogger();
  webpack = gulpWebpack;

  gulp.task('webpack_client', main);
}

catch (err) {}

function main() {
  process.on('uncaughtException', error);

  try {return buildWebpackClient();}

  catch (err) {error(err);}
}

function error(err) {
  console.error(err.stack || err);
  process.nextTick(process.exit);
}

function buildWebpackClient() {
  var compiler = createWebpackClient(null, null, build),
      output = build();

  return global.is_watching ? {} : output;

  function build() {
    gulp.src(config.task.webpack_src)
      .pipe(compiler)
      .pipe(gulp.dest(config.task.webpack_dest));
  }
}

function createWebpackClient(config, options, build) {
  /*jshint maxstatements:20, maxcomplexity:10*/

  config = config || global.config;
  options = options || {};

  var compiler = webpack(config.webpack);

  if (build && (global.is_watching || options.watch)) {
    compiler.watch(200, function (err, stats) {
      logger.log('Changed', stats);

      if (err) logger.error(err);

      build();
    });
  }

  return compiler;
}
