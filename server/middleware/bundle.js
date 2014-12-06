'use strict';

var webpack = require('webpack');

var webpackMiddleware = require('./lib/koa_webpack_middleware.js');
// var koa_webpack_dev = require('koa-webpack-dev');

// webpack_config.inline = true;
// webpack_config = koa_webpack_dev.configure(webpack_config);

var compiler = webpack(config.webpack);

app.base.use(webpackMiddleware(compiler, {quiet: true}));
// app.use(koa_webpack_dev.middleware(compiler, {}));
