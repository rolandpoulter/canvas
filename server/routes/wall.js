'use strict';
var sendIndex = require('./lib/sendIndex.js');

exports.create = function (app) {
  app.get('/:owner',       sendIndex);
  app.get('/:owner/:wall', sendIndex);
};
