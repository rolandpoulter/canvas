'use strict';

var kroute = require('kroute');

exports.create = kroute;

exports.load = function (app) {
  app = app || global.app;

  if (app.router) return;

  app.router = exports.create();
  app.use(app.router);
};
