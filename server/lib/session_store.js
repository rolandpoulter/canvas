'use strict';

var redisStore = require('koa-redis');

var session_store = redisStore({
  // prefix: 'sess:',
  client: app.db.redis.schema.client
});

module.exports = session_store;
