'use strict';

// var Schema = require('jugglingdb').Schema;

module.exports = app.db.mongo.schema.define('User', {
  identities: [],
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

module.exports.identity = function () {

};
