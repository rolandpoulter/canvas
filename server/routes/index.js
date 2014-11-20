/*jshint ignore:start*/
'use strict';

var sendIndex = require('./lib/send_index.js');

app.router.all('/', sendIndex);
