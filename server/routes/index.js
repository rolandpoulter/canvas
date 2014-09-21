/*jshint ignore:start*/
'use strict';

var sendIndex = require('./lib/sendIndex.js');

app.router.all('/', sendIndex);
