'use strict';

var redisStore = require('koa-redis');

var session_store = redisStore({
  client: app.db.redis.schema.client
});

module.exports = exports = session_store;

var get = exports.get;

exports.get = function *(sid) {
  console.log('GET SESSION', sid);

  var session = yield get.call(this, sid);

  return session;
};
