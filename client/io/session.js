'use strict';
/*global app, document, unescape*/
var session_stream = app.ws.ch.channel('session');

module.exports = session_stream;

var sessionCallbacks = [];

app.onceSessionReady = session_stream.onceSessionReady = function (callback) {
  if (app.session) return callback(app.session);
  sessionCallbacks.push(callback);
};

session_stream.onopen = function () {
  var session_id = getCookieProperty(app.config.session_key);
  console.log(session_id);
  session_stream.send(session_id);
};

setInterval(session_stream.onopen, 1000 * 60 * 6);

session_stream.onmessage = function (event) {
  app.session = JSON.parse(event.data);
  // console.log(app.session);
  var sessionCallback;
  while ((sessionCallback = sessionCallbacks.shift())) {
    setTimeout(sessionCallback.bind(null, app.session), 0);
  }
};

session_stream.onclose = function () {};

function getCookieProperty(cookie_name) {
  console.log(document.cookie);
  // Get name followed by anything except a semicolon
  var cookieRegExp = new RegExp('' + cookie_name + '[^;]+');
  var cookieProperty = cookieRegExp.exec(document.cookie);
  if (!cookieProperty) return null;
  // Return everything after the equal sign
  return unescape(cookieProperty.toString().replace(/^[^=]+./, ''));
}
