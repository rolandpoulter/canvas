ws = new SockJS(window.location + '/ws');

ws.ch = new WebSocketMultiplex(ws);

require('./io/board');
require('./io/config');
require('./io/entity');
require('./io/session');
require('./io/user');
require('./io/view');
require('./io/wall');
