'use strict';

var sendIndex = require('./lib/send_index.js');

console.log('wall routes');

app.router.get('/',              sendIndex);
app.router.get('/w/:owner',       sendIndex);
app.router.get('/w/:owner/:wall', sendIndex);
