'use strict';

// var Schema = require('jugglingdb').Schema;

module.exports = app.db.mongo.schema.define('Entity', {
  // name: {type: String, length: 255},
  // user: {type: Schema.ObjectId, index: true},
  // wall: {type: Schema.ObjectId, index: true},
  // body: {type: String},
  // meta: {type: Schema.JSON},
  // loc: {
  //   x: Number,
  //   y: Number
  // },
  date: {type: Date, default: Date.now},
  mdate: {type: Date, default: Date.now},
  scale: Number,
  position: Object,
  // layer: {type: Number},
  // hidden: {type: Boolean},
  // comments: [{body: String, date: Date}]
}, {
  table: 'entities'
});
