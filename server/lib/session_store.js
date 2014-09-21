'use strict';

var redisStore = require('koa-redis');

var session_store = redisStore({
  prefix: 'sess:',
  client: app.redis
});

module.exports = session_store;
