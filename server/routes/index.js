'use strict';

var sendIndex = require('./lib/sendIndex.js');

app.router.get('/', sendIndex);
