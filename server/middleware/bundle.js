'use strict';

var webpack = require('webpack'),
    webpackMiddleware = require('../lib/koaWebpackMiddleware.js');

var webpack_config = require('../../tasks/webpack_client.js').create(null, {
  returnConfig: true
});

var compiler = webpack(webpack_config);

app.use(webpackMiddleware(compiler, {quiet: true}));
