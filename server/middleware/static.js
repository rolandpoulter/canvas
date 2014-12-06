'use strict';

var staticServer = require('koa-static');

app.base.use(staticServer(
  config.server.app.static_path,
  {
    index: 'index.html',
    defer: true,
    hidden: true,
    maxage: config.server.app.static_max_age || 0
  }
));
