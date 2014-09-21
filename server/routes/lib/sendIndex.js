/*jshint ignore:start*/
'use strict';

module.exports = sendIndex;

function* sendIndex(next) {
  yield* this.fileServer.send('index.html');
}
