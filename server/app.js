'use strict';

app.name = 'wall-io-canvas';
app.keys = ['key1', 'key2'];

app.db = app.db || {};
app.db.mongo = require('./db/mongo.js');
app.db.redis = require('./db/redis.js');

app.model = app.model || {};
require('./model/Entity.js');
require('./model/Session.js');
require('./model/User.js');
require('./model/View.js');
require('./model/Wall.js');

app.io = app.io || {messengers: [
  require('./io/entity.js'),
  require('./io/session.js'),
  require('./io/user.js'),
  require('./io/wall.js')
]};

// Middleware
// require('./middleware/bundle.js').load();
// require('./middleware/styles.js').load();
require('./middleware/websockets.js').load();
require('./middleware/session.js').load();
require('./middleware/passport.js').load();
require('./middleware/router').load();

// Routes
require('./routes/authentication.js');
require('./routes/config.js');
require('./routes/index.js');
require('./routes/wall.js');
