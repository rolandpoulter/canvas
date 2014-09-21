'use strict';

var Schema = require('jugglingdb').Schema;

module.exports = app.db.mongo.schema.define('Entity', {
  name: {type: String, length: 255},
  // user: {type: Schema.ObjectId, index: true},
  body: {type: String},
  meta: {type: Schema.JSON},
  date: {type: Date, default: Date.now},
  mdate: {type: Date, default: Date.now},
  layer: {type: Number},
  hidden: {type: Boolean},
  comments: [{body: String, date: Date}]
}, {});
