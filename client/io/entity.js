'use strict';
/*global app*/
var entity_stream = app.ws.ch.channel('entity');

module.exports = exports = entity_stream;

app.io.entity = exports;

var client_id = 0,
    data_callbacks = {
      update: [],
      get: {},
      set: {}};

app.getClientID = function () {
  var id = client_id.toString(32);

  client_id += 1;

  return id;
};

app.getEntityById = function (id, callback) {
  app.getEntities({
    where: {id: id},
    limit: 1
  }, function (err, entities) {
    callback(err, entities && entities[0]);
  });
};

app.getEntities = function (query, callback) {
  if (typeof callback !== 'function')
    throw new Error('Invalid argument type: ' + typeof callback);

  var callback_id = app.getClientID();

  data_callbacks.get[callback_id] = callback;

  entity_stream.send(
    ['get', callback_id, JSON.stringify(query)].join('|'));
};

app.setEntity = function (id, entity, callback) {
  if (typeof callback !== 'function')
    throw new Error('Invalid argument type: ' + typeof callback);

  var callback_id = app.getClientID();

  data_callbacks.set[callback_id] = callback;

  entity_stream.send(
    ['set', callback_id, id, JSON.stringify(entity)].join('|'));
};

app.removeEntity = function (id, callback) {
  app.setEntity(id, null, callback);
};

app.onEntityUpdate = function (callback) {
  data_callbacks.update.push(callback);
};

entity_stream.onmessage = function (event) {
  /*jshint maxstatements:15*/
  var data = event.data.split('|'),
      method = data[0];

  var callback_id,
      response,
      error;

  if (method === 'update') {
    response = JSON.parse(data[1]);

    return data_callbacks.update.forEach(function (callback) {
      callback(response);
    });
  }

  callback_id = data[1];
  response = JSON.parse(data[2]);
  error = data[3];

  if (!data_callbacks[method] || !data_callbacks[method][callback_id])
    throw new Error('Received invalid entity data: ' + event.data);

  console.log(error, response);

  data_callbacks[method][callback_id](error, response);

  delete data_callbacks[method][callback_id];
};
