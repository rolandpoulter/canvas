'use strict';
var app = global.app = {};

app.model = require('bulk-require')(__dirname, ['model/*.js']).model;

require('./io');
require('./ui');
