'use strict';

var passport = require('koa-passport');

// app.use(function* () { this.session.passport = this.session.passport || {}; });

app.use(passport.initialize());
app.use(passport.session());
