'use strict';

var view_channel = app.ws.ch.registerChannel('view');

// var View = app.model.view;

module.exports = view_channel;

// var connections = [];

view_channel.on('connection', function (view_stream) {
  // console.log(connections.length);
  // connections.push(view_stream);

  view_stream.on('close', function () {
    // TODO: remove connection
  });

  view_stream.on('data', function (data) {
    // console.log(data);
    // connections.forEach(function (vs) {
      // vs.write(data);
    // });
    view_stream.conn.broadcast('view', data);
    // View.upsert(JSON.parse(data));
  });
});
