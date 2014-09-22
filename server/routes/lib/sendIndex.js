/*jshint ignore:start*/
'use strict';

module.exports = sendIndex;

function* sendIndex() {
  this.session.name = 'roland';
  this.session = this.session;
  yield* this.fileServer.send('index.html');
}
