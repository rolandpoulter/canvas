'use strict';

var // Schema = require('jugglingdb').Schema,
    ObjectID = require('../db/mongo.js').schema.ObjectID;

module.exports = app.db.mongo.schema.define('Entity', {
  user: {type: ObjectID, index: true},
  wall: {type: ObjectID, index: true},
  meta: {type: Object, default: {}},
  name: {type: String, length: 255, index: true},
  type: {type: String, length:  32, index: true},
  date:  {type: Date, default: Date.now, index: true},
  mdate: {type: Date, default: Date.now, index: true},
  space: {type: Object, default: {}},
  layer: {type: Number, default: 0, index: true},
  scale: {type: Number, default: 1, index: true},
  hidden: {type: Boolean, default: false, index: true}
}, {
  table: 'entities'
});

// console.log(module.exports);
