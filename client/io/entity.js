'use strict';
/*global app*/
var config_stream = app.ws.ch.channel('config');

module.exports = config_stream;

config_stream.onopen = function () {
  console.log('config stream opened.');
};

config_stream.onmessage = function (event) {
  console.log('config stream data:', event.data);
};

config_stream.onclose = function () {
  console.log('config stream closed.');
};
