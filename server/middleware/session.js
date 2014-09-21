'use strict';

var session = require('koa-generic-session'),
    redisStore = require('koa-redis');

var sessionStore = redisStore({
  prefix: 'sess:',
  client: app.redis
});

module.exports = sessionStore;
