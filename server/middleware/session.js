'use strict';

var session = require('koa-generic-session');

var expire_time = 1000 * 60 * 60 * 24 * 7; // 1 week

app.use(session({
  ttl: expire_time,
  key: 'wall.id',
  // TODO: figure out how to get a deferred session
  // defer: true,
  // prefix: 'koa:sess:',
  rolling: true,
  // TODO: figure out how to save the session without rolling:true
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: expire_time,
    overwrite: true,
    secureProxy: false
  },
  store: require('../lib/session_store.js')
}));
