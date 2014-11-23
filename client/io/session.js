'use strict';
/*global app, document, unescape*/
var session_stream = app.ws.ch.channel('session');

module.exports = session_stream;

var session_callbacks = [],
    session = null;

app.onSession = function (callback) {
  if (session) callback(session);

  session_callbacks.push(callback);
};

session_stream.onopen = function () {
  var session_id = getCookieProperty(app.config.session_key);

  session_stream.send(session_id);
};

// Ping session to keep it alive.
setInterval(session_stream.onopen, 1000 * 60 * 6);

session_stream.onmessage = function (event) {
  session = JSON.parse(event.data);

  app.session = session;

  session_callbacks.forEach(function (callback) {
    callback(session);
  });
};

function getCookieProperty(cookie_name) {
  // Get name followed by anything except a semicolon
  var cookieRegExp = new RegExp('' + cookie_name + '[^;]+'),
      cookieProperty = cookieRegExp.exec(document.cookie);

  if (!cookieProperty) return null;

  // Return everything after the equal sign
  return unescape(cookieProperty.toString().replace(/^[^=]+./, ''));
}
