'use strict';

app.io = app.io || {messengers: []};

require('./io/entity.js');
require('./io/session.js');
require('./io/user.js');
require('./io/wall.js');

// require('./middleware/bundle.js').load();
// require('./middleware/styles.js').load();

require('./middleware/websockets.js').load();
// require('./middleware/session.js').load();
// require('./middleware/routes.js').load();

// app.schema = app.schema || {};
//
// require('./schema/entity.js');
// require('./schema/session.js');
// require('./schema/user.js');
// require('./schema/view.js');
// require('./schema/wall.js');
//
// app.model = app.model || {};
//
// require('./model/Entity.js');
// require('./model/Session.js');
// require('./model/User.js');
// require('./model/View.js');
// require('./model/Wall.js');
