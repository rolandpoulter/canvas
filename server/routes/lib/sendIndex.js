/*jshint ignore:start*/
'use strict';

var path = require('path');

module.exports = sendIndex;

function* sendIndex() {
  yield* this.fileServer.push(path.join(__dirname, '..', '..', '..',
                                        'client', 'static', 'index.html'));
}
