'use strict';

var session = require('koa-generic-session');

var expire_time = 1000 * 60 * 60 * 24 * 7; // 1 week

app.config.session = {
  ttl: expire_time,
  key: 'wall.id',
  prefix: 'wall.sess:',
  defer: true,
  rolling: false,
  allowEmpty: true,
  cookie: {
    path: '/',
    maxAge: expire_time,
    signed: false,
    secure: false,
    httpOnly: false,
    overwrite: true,
    secureProxy: false
  },
  store: require('../lib/session_store.js')
};

app.use(session(app.config.session));
