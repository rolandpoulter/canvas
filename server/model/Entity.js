var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var entitySchema = new (mongoose.Schema)({
  name: String,
  user: {
    type: Types.ObjectId,
    index: true
  },
  board: {
    type: Types.ObjectId,
    index: true
  },
  body: Types.Mixed,
  meta: {},
  date: {
  	type: Date,
  	default: Date.now
  },
  mdate: {
    type: Date,
    default: Date.now
  },
  layer: Number,
  hidden: Boolean,
  comments: [
  	{body: String, date: Date}
  ]
});

module.exports = mongoose.model('Entity', entitySchema);
