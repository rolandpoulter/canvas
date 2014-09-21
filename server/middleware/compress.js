'use strict';

var compress = require('koa-compress');

exports.load = function (app) {
  app = app || global.app;

  app.use(compress({
    threshold: 1048,
    flush: require('zlib').Z_SYNC_FLUSH
  }));
};
