'use strict';

var passport = require('koa-passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    // TumblrStrategy = require('passport-tumblr').Strategy,
    // InstagramStrategy = require('passport-instagram').Strategy,
    // VineStrategy = require('passport-vine').Strategy,
    GoogleStrategy = require('passport-google').Strategy;

var User = require('../model/User.js');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new LocalStrategy(function(email, pass, done) {
  User.authenticate(email, pass, done);
}));

passport.use(new FacebookStrategy({
    clientID: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL:
      'http://localhost:' + (process.env.PORT || 3000) +
      '/auth/facebook/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));

passport.use(new TwitterStrategy({
    consumerKey: 'your-consumer-key',
    consumerSecret: 'your-secret',
    callbackURL:
      'http://localhost:' + (process.env.PORT || 3000) +
      '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));

passport.use(new GoogleStrategy({
    returnURL:
      'http://localhost:' + (process.env.PORT || 3000) +
      '/auth/google/callback',
    realm:
      'http://localhost:' + (process.env.PORT || 3000)
  },
   function(identifier, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));

app.base.use(function* (next) {
  if (config.debug)
    logger.log('SESSION_ID', this.cookies.get('wall.id', true));

  this.getSession = this.session;
  this.session = yield this.session;
  this.request.session = this.session;

  yield next;
});

app.base.use(passport.initialize());

app.base.use(passport.session());
