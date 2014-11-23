'use strict';

var ObjectID = require('../db/mongo.js').schema.ObjectID;

var identifier_channel = app.ws.ch.registerChannel('identifier');

module.exports = identifier_channel;

identifier_channel.on('connection', function (identifier_stream) {
  identifier_stream.on('data', function (data) {
    var identifier = null;

    if (data === 'ObjectID')
      identifier = new ObjectID();

    identifier_stream.write(data + '|' + identifier);
  });
});
