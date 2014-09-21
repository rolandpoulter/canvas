'use strict';

var webpack = require('webpack'),
    webpackMiddleware = require('webpack-dev-middleware');

exports.load = function (app) {
  app = app || global.app;

  if (app.bundle) return;

  app.bundle = true;

  var webpack_config = require('../../tasks/webpack_client.js').create(null, {
    returnConfig: true
  });

  var compiler = webpack(webpack_config);

  app.use(webpackMiddleware(compiler, {}));
};
