'use strict';

var view_channel = app.ws.ch.registerChannel('view');

var View = app.model.view,
    schema = require('../db/mongo.js').schema,
    ObjectID = schema.ObjectID;

module.exports = view_channel;

var id = new ObjectID();

view_channel.on('connection', function (view_stream) {
  view_stream.on('data', function (data) {
    view_stream.conn.broadcast('view', data);
    data = JSON.parse(data);
    data.id = id;
    View.upsert(data, function () {
      console.log('upsert view:', arguments);
    });
  });
});
