'use strict';

require('../config');
require('../logger.js');

if (config.debug && app.debug) app.debug();

app.db = {};
require('./db/mongo.js');
require('./db/redis.js');

app.model = {};
require('./model/Entity.js');
require('./model/Session.js');
require('./model/User.js');
require('./model/Wall.js');

app.middleware = {};
require('./middleware/bundle.js');
require('./middleware/styles.js');
require('./middleware/static.js');
require('./middleware/session.js');
require('./middleware/router.js');

app.io = {};
require('./ws.js');
require('./io/entity.js');
require('./io/identifier.js');
require('./io/session.js');

app.routes = {};
require('./routes/config.js');
require('./routes/wall.js');

// if (module.hot) module.hot.accept();
