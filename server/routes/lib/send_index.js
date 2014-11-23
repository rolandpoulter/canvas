/*jshint ignore:start*/
'use strict';

var ObjectID = require('../../db/mongo.js').schema.ObjectID;

module.exports = sendIndex;

function* sendIndex() {
  // console.log('SESSION_ID', this.cookies.get('wall.id', true));

  var session = yield this.session;
  // session.name = 'roland';
  if (!session.view_id) session.view_id = new ObjectID();

  this.session = session;

  yield* this.fileServer.send('index.html');
}
