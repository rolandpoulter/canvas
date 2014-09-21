'use strict';

var kroute = require('kroute');

exports.create = kroute;

exports.load = function (app) {
  app = app || global.app;

  app.router = app.router || exports.create();
};
