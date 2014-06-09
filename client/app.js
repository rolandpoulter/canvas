'use strict';
var app = global.app = {};

app.$ = global.jQuery;
app.events = global.events;

app.model = require('bulk-require')(__dirname, ['model/*.js']).model;

require('./io');
require('./ui');
