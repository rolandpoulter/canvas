'use strict';

var hogan = require('hogan.js');

app.ui.partials = exports;

exports.account = hogan.compile(require('./partials/account.ms'));
exports.login = hogan.compile(require('./partials/login.ms'));
exports.wall = hogan.compile(require('./partials/wall.ms'));
