'use strict';

var session = require('koa-generic-session');

exports.load = function (app) {
  app = app || global.app;

  if (app.session) return;
  app.session = true;

  app.use(session({
    redisStore: require('../lib/session_store.js')
  }));
};
