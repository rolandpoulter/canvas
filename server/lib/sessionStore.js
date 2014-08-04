'use strict';
/*global app*/
var session = require('express-session'),
    RedisStore = require('connect-redis')(session);

var sessionStore = new RedisStore({
  prefix: 'sess:',
  client: app.redis
});

module.exports = sessionStore;
