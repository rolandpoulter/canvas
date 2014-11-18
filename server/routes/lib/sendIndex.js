/*jshint ignore:start*/
'use strict';

module.exports = sendIndex;

function* sendIndex() {
  var session = yield this.session;
  session.name = 'roland';
  this.session = session;
  yield* this.fileServer.send('index.html');
}
