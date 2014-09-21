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
require('./model/Entity.js');
require('./model/Session.js');
require('./model/User.js');
require('./model/View.js');
require('./model/Wall.js');

// Middleware
require('./middleware/bundle.js');
require('./middleware/styles.js');
require('./middleware/static.js');
require('./middleware/websockets.js');
require('./middleware/session.js');
require('./middleware/passport.js');
require('./middleware/router.js');

// Routes
require('./routes/authentication.js');
require('./routes/config.js');
require('./routes/index.js');
require('./routes/wall.js');

app.io = app.io || [
  require('./io/entity.js'),
  require('./io/session.js'),
  require('./io/user.js'),
  require('./io/view.js'),
  require('./io/wall.js')
];
