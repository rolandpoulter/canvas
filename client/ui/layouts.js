'use strict';

var hogan = require('hogan.js');

app.ui.layouts = exports;

exports.main = hogan.compile(require('./layouts/main.ms'));
