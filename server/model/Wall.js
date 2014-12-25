'use strict';

var // Schema = require('jugglingdb').Schema,
    ObjectID = require('../db/mongo.js').schema.ObjectID;

module.exports = app.db.mongo.schema.define('Wall', {
  user: {type: ObjectID, index: true},
  meta: {type: Object, default: {}},
  name: {type: String, length: 255, index: true},
  date: {type: Date, default: Date.now},
  mdate: {type: Date, default: Date.now}
}, {
  table: 'walls'
});
