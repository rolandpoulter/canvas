'use strict';

var session = require('koa-generic-session');

app.use(session({
  key: 'wall.id',
  cookie: {
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: require('../lib/session_store.js')
}));
