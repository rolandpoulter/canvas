'use strict';

exports.build = buildWebpackClient;

exports.create = createWebpackClient;

global.config = global.config || require('../config');

var log = console.log,
    path = require('path'),
    webpack = require('webpack');

if (!module.parent) {
  webpack = require('gulp-webpack');
  main();
}

else try {
    log = require('gulp-util').log;
    webpack = require('gulp-webpack');
    require('gulp').task('webpack_client', main);
  } catch (err) {}

function main() {
  process.on('uncaughtException', error);
  try { return buildWebpackClient(); } catch (err) { error(err); }
}

function error(err) {
  console.error(err.stack || err);
  process.nextTick(process.exit);
}

function buildWebpackClient() {
  var compiler = createWebpackClient(null, null, build),
      o = build();

  return global.is_watching ? {} : o;

  function build() {
    var gulp = require('gulp');
    gulp.src('client/index.js')
      .pipe(compiler)
      .pipe(gulp.dest('static/js'));
  }
}

function createWebpackClient(config, options, build) {
  /*jshint maxstatements:20, maxcomplexity:10*/

  config = config || global.config;
  options = options || {};

  var webpack_config = {
    name: 'client',
    entry: [
      path.join(__dirname, '..', 'client', 'index.js')
    ],
    output: {
      path: path.join(__dirname, '..', 'static', 'js'),
      filename: 'client.js'
    },
    module: {
      loaders: [
        {test: /\.coffee$/, loader: 'coffee-redux-loader'},
        {test: /\.jsx$/,    loader: 'react-hot-loader!jsx-loader' +
                                    '?harmony&insertPragma=React.DOM'},
        {test: /\.json$/,   loader: 'json-loader'},
        {test: /\.json5$/,  loader: 'json5-loader'},
        {test: /\.txt$/,    loader: 'raw-loader'},
        {test: /\.html$/,   loader: 'html-loader'},
        {test: /\.md$/,     loader: 'html-loader!markdown-loader'},
        {test: /\.ms$/,     loader: 'mustache-loader'},
        {test: /\.png$/,    loader: 'url-loader'},
        {test: /\.obj$/,    loader: 'file-loader'},
        {test: /\.css$/,    loader: 'style-loader!css-loader'}
      ]
    },
    plugins: []
  };

  if (options.returnConfig) {
    return webpack_config;
  }

  var compiler = webpack(webpack_config);

  if (build && (global.is_watching || options.watch)) {
    compiler.watch(200, function (err, stats) {
      if (err) console.error(err);
      log('Changed', stats);
      build();
    });
  }

  return compiler;
}
