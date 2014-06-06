var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var wallSchema = new (mongoose.Schema)({
  name: String,
  user: {
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
  date: {
    type: Date,
    default: Date.now
  },
  mdate: {
    type: Date,
    default: Date.now
  },
  layer: Number,
  hidden: Boolean
});

module.exports = mongoose.model('Wall', wallSchema);
