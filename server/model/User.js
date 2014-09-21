'use strict';

// var Schema = require('jugglingdb').Schema;

module.exports = app.db.mongo.schema.define('User', {
  name: {type: String, length: 255, index: true},
  pass: {type: String, length: 255, index: true},
  email: {type: String, index: true},
  date: {type: Date, default: Date.now},
  mdate: {type: Date, default: Date.now}
});
