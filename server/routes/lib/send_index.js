/*jshint ignore:start*/
'use strict';

module.exports = sendIndex;

function* sendIndex() {
  console.log('SESSION_ID', this.cookies.get('wall.id', true));
  var session = yield this.session;
  session.name = 'roland';
  this.session = session;
  yield* this.fileServer.send('index.html');
}
