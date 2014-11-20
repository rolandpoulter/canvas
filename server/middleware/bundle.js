'use strict';

var webpack = require('webpack');

var webpack_config = require('../../tasks/webpack_client.js').create(null, {
  returnConfig: true
});

var webpackMiddleware = require('../lib/koa_webpack_middleware.js');
// var koa_webpack_dev = require('koa-webpack-dev');

// webpack_config.inline = true;
// webpack_config = koa_webpack_dev.configure(webpack_config);

var compiler = webpack(webpack_config);

app.use(webpackMiddleware(compiler, {quiet: true}));
// app.use(koa_webpack_dev.middleware(compiler, {}));
