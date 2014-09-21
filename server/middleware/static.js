'use strict';

var path = require('path'),
    // compress = require('compress'),
    // fileServer = require('koa-file-server');
    staticServer = require('koa-static');

// app.use(compress());

app.use(staticServer(
  config.static_root || path.join(__dirname, '..', '..', 'static'),
  {
    index: 'index.html',
    defer: true,
    hidden: true,
    maxage: config.static_max_age || 0
  }
));
