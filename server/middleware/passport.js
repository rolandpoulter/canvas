'use strict';

var passport = require('koa-passport');

exports.load = function (app) {
  app = app || global.app;

  if (app.passport) return;
  app.passport = true;

  app.use(passport.initialize());
  app.use(passport.session());
};
