'use strict';
/*global app*/
var wall_stream = app.ws.ch.channel('wall');

module.exports = wall_stream;

// wall_stream.onopen = function () {
  // console.log('wall stream opened.');
// };

// wall_stream.onmessage = function (event) {
  // console.log('wall stream data:', event.data);
// };

// wall_stream.onclose = function () {
  // console.log('wall stream closed.');
// };
