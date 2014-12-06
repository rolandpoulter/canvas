'use strict';

var compress = require('koa-compress');

app.base.use(compress({
  threshold: 1048,
  flush: require('zlib').Z_SYNC_FLUSH
}));
