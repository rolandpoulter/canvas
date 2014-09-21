'use strict';

var session = require('koa-generic-session');

app.use(session({
  redisStore: require('../lib/session_store.js')
}));
