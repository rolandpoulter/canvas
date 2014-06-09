'use strict';
var path = require('path');

module.exports = sendIndex;

function sendIndex(request, response) {
  response.sendfile(
    path.join(__dirname, '..', '..', '..', 'client', 'static', 'index.html')
  );
}
