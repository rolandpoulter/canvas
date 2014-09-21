'use strict';

var Schema = require('jugglingdb').Schema;

app.db.redis = exports;

exports.schema = new Schema('redis', {port: 6379});
