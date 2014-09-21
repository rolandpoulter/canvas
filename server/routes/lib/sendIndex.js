/*jshint ignore:start*/
'use strict';

module.exports = sendIndex;

function* sendIndex() {
  console.log(this.session);
  yield* this.fileServer.send('index.html');
}
