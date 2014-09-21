'use strict';

var Schema = require('jugglingdb').Schema;

app.db.mongo = exports;

exports.schema = new Schema('mongodb', {
  url: 'mongodb://localhost/myapp'
});
