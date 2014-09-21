'use strict';

require('http-proxy').createProxyServer({
  target: 'http://localhost:9000'
}).listen(8000);
