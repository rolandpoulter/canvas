'use strict';
/*jshint noyield:true*/

var passport = require('koa-passport');

app.router.get('/user', function* () {
  yield this.session;
});

app.router.post('/auth/custom', function* (next) {
  var ctx = this;
  yield* passport.authenticate('local', function* (err, user, info) {
    /*jshint unused:false*/
    if (err) throw err;
    if (user === false) {
      ctx.status = 401;
      ctx.body = { success: false };
    } else {
      yield ctx.login(user);
      ctx.body = { success: true };
    }
  }).call(this, next);
});

var redirects = {
  successRedirect: '/',
  failureRedirect: '/#failedLogin'
};

app.router.post('/login',
  passport.authenticate('local', redirects));

app.router.get('/logout', function* (next) {
  /*jshint unused:false*/
  this.logout();
  this.redirect('/');
});

// app.router.get('/auth/facebook', passport.authenticate('facebook'));
// app.router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', redirects));

app.router.get('/auth/google', passport.authenticate('google'));
app.router.get('/auth/google/callback',
  passport.authenticate('google', redirects));

// app.router.get('/auth/twitter', passport.authenticate('twitter'));
// app.router.get('/auth/twitter/callback',
//   passport.authenticate('twitter', redirects));
