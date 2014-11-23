'use strict';

// var Schema = require('jugglingdb').Schema;

module.exports = app.db.mongo.schema.define('Wall', {
  name: {type: String, length: 255},
  // user: {type: Schema.ObjectId, index: true},
  // loc: {
  //   x: Number,
  //   y: Number
  // },
  // scale: {
  //   x: Number,
  //   y: Number
  // },
  date: {type: Date, default: Date.now},
  mdate: {type: Date, default: Date.now},
  layer: Number,
  hidden: Boolean
}, {
  table: 'walls'
});
