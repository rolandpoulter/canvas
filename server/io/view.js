'use strict';

var view_channel = app.ws.ch.registerChannel('view');

module.exports = view_channel;

view_channel.on('connection', function (view_stream) {
  view_stream.on('data', function (data) {
    console.log('view', data);
  });
});
