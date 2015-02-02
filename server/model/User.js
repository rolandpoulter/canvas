'use strict';

// var Schema = require('jugglingdb').Schema;

module.exports = app.db.mongo.schema.define('User', {
  identities: Object,
  email: {type: String, length: 255, index: true},
  pass: {type: String, length: 32, index: true},
  date: {type: Date, default: Date.now},
  mdate: {type: Date, default: Date.now}
}, {
  table: 'users'
});

module.exports.authenticate = function (email, pass, callback) {
  this.findOne({email: email}, function (err, user) {
    if (err) return callback(err);
    if (!user) return callback(null, false, {
      message: 'Incorrect username.'
    });
    if (user.pass !== pass) return callback(null, false, {
      message: 'Incorrect password.'
    });
    return callback(null, user);
  });
};

module.exports.identity = function (emails, provider, profile, callback) {
  var User = module.exports;
  this.findOne({email: {$in: emails}}, function (err, user) {
    if (err) return callback(err);
    if (!user)
      user = new User({
        identities: {},
        email: emails[0],
        pass: false
      });
    var identities =
      user.identities[provider] = user.identities[provider] || [];
    var index = -1;
    identities.some(function (identity, i) {
      var identityEmails = identity.emails.map(function (wrapper) {
        return wrapper.value;
      });
      if (identityEmails.join(',') === emails.join(',')) {
        index = i;
        return true;
      }
    });
    if (index === -1)
      identities.push(profile);
    else
      identities[index] = profile;
    user.save();
    callback(null, user);
  });
};
