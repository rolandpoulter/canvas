/*jshint ignore:start*/
'use strict';

module.exports = sendIndex;

function* sendIndex(next) {
  // console.log('send index.html');
  // if (['js','css','image','index.html'].indexOf(this.params.owner)) {
  //   yield* next;
  // }
  yield* this.fileServer.send('index.html');
}
