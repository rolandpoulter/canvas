'use strict';

// app.debug();

app.name = 'wall-io-canvas';

app.keys = [
  'wall-io-canvas_key_1',
  'key_canvas-io-wall_2'
];

app.db = app.db || {};
app.db.mongo = require('./db/mongo.js');
app.db.redis = require('./db/redis.js');

app.model = app.model || {};
app.model.Entity = require('./model/Entity.js');
app.model.Session = require('./model/Session.js');
app.model.User = require('./model/User.js');
app.model.Wall = require('./model/Wall.js');

// Middleware
require('./middleware/bundle.js');
require('./middleware/styles.js');
require('./middleware/static.js');
require('./middleware/websockets.js');
require('./middleware/session.js');
require('./middleware/router.js');

// Routes
require('./routes/config.js');
require('./routes/index.js');
require('./routes/wall.js');

app.io = app.io || [
  require('./io/entity.js'),
  require('./io/identifier.js'),
  require('./io/session.js')
];
