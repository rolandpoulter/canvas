'use strict';
/*global app*/
var entity_stream = app.ws.ch.channel('view');

module.exports = exports = entity_stream;

app.io.entity = exports;

var client_id = 0,
    data_callbacks = {
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

  data_callbacks.get[callback_id] = function (err, entities) {
    callback(err, JSON.parse(entities));
  };

  entity_stream.send(
    ['get', callback_id, JSON.stringify(query)].join('|'));
};

app.setEntity = function (id, entity, callback) {
  if (typeof callback !== 'function')
    throw new Error('Invalid argument type: ' + typeof callback);

  var callback_id = app.getClientID();

  data_callbacks.set[callback_id] = function (err, entity) {
    callback(err, JSON.parse(entity));
  };

  entity.send(
    ['set', callback_id, id, JSON.stringify(entity)].join('|'));
};

app.removeEntity = function (id, callback) {
  app.setEntity(id, null, callback);
};

entity_stream.onmessage = function (event) {
  var data = event.data.split('|'),
      method = data[0],
      callback_id = data[1],
      response = JSON.parse(data[2]),
      error = data[3];

  if (!data_callbacks[method] || !data_callbacks[method][callback_id])
    throw new Error('Received invalid entity data: ' + event.data);

  data_callbacks[method][callback_id](error, response);

  delete data_callbacks[method][callback_id];
};
