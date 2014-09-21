'use strict';
/*global app*/
var view_stream = app.ws.ch.channel('view');

module.exports = view_stream;

view_stream.onopen = function () {
  console.log('view stream opened.');
};

view_stream.onmessage = function (event) {
  console.log('view stream data:', event.data);
};

view_stream.onclose = function () {
  console.log('view stream closed.');
};
