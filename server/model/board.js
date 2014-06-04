var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var boardSchema = new (mongoose.Schema)({
  name: String,
  user: {
    type: Types.ObjectId,
    index: true
  },
  wall: {
    type: Types.ObjectId,
    index: true
  },
  loc: {
    x: Number,
    y: Number
  },
  scale: {
    x: Number,
    y: Number
  },
  layer: Number,
  parent: {
    type: Types.ObjectId,
    index: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mdate: {
    type: Date,
    default: Date.now
  },
  hidden: Boolean
});

module.exports = mongoose.model('Board', boardSchema);
