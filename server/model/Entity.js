'use strict';

var mongo = require('../db/mongo.js'),
    ObjectID = mongo.schema.ObjectID;

module.exports = app.db.mongo.schema.define('Entity', {
  user: {type: ObjectID, index: true},
  wall: {type: ObjectID, index: true},
  view: {type: ObjectID, index: true},
  meta: {type: Object, default: {
    label: '',
    layer: 0,
    log: [],
    position: {x: 0, y: 0},
    refs: {},
    scale: 1,
    size: {x: 0, y: 0},
    text: '',
    url: ''
  }},
  name: {type: String, length: 255, index: true},
  type: {type: String, length: 255, index: true},
  date:  {type: Date, default: Date.now, index: true},
  mdate: {type: Date, default: Date.now, index: true},
  shape: {type: Object, default: {}},
  private: {type: Boolean, default: false, index: true}
}, {
  table: 'entities'
});

mongo.schema.on('connected', function () {
  var entities = mongo.schema.client.collection('entities');

  entities.ensureIndex({shape: '2dsphere'});
});
