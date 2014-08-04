'use strict';
/*global app*/
var user_stream = app.ws.ch.channel('user');

module.exports = user_stream;

user_stream.onopen = function () {
  console.log('user stream opened.');
};

user_stream.onmessage = function (event) {
  console.log('user stream data:', event.data);
};

user_stream.onclose = function () {
  console.log('user stream closed.');
};
