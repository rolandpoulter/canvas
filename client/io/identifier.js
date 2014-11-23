'use strict';
/*global app*/
var identifier_stream = app.ws.ch.channel('identifier');

module.exports = exports = identifier_stream;

app.io.identifier = exports;

var data_callbacks = {};

app.getObjectID = function (callback) {
  if (typeof callback !== 'function')
    throw new Error('Invalid argument type: ' + typeof callback);

  if (data_callbacks.ObjectID)
    data_callbacks.ObjectID.push(callback);

  else
    data_callbacks.ObjectID = [callback];

  identifier_stream.send('ObjectID');
};

identifier_stream.onmessage = function (event) {
  var data = event.data.split('|'),
      stack = data_callbacks[data[0]];

  if (stack && stack.length) stack.pop()(data[1]);

  else throw new Error(
    'Received identifier data without callback: ' + event.data);
};
