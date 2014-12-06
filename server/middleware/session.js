'use strict';

var session = require('koa-generic-session'),
    session_store = require('../lib/session_store.js');

var session_config = config.server.app.session;

session_config.store = session_store;

app.base.use(session(session_config));
