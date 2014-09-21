// app.use(function* (next) {
//   this.body = 'Hello World';
//   yield next;
// });

// app.mongo = require('mongoose').connect(config.mongo);
// app.redis = require('redis').createClient(
//   config.redis.port,
//   config.redis.host
// );
//
// app.model = bulk('model/*.js').model;

// app.use(require('compression')());
// app.use(require('errorhandler')());
// app.use(require('morgan')('dev'));
//
// app.use(require('response-time')());
// app.use(require('body-parser')());
// app.use(require('method-override')());
//
// app.use(require('cookie-parser')());
// app.use(require('express-session')({
//   key:  config.webclient.session_key,
//   name: config.webclient.session_key,
//   proxy: false,
//   store: require('./lib/sessionStore'),
//   secret: 'lalafoofoo secret meemeeseecoo',
//   cookie: {path: '/', httpOnly: false, secure: false, maxAge: null},
//   rolling: true,
//   resave: true,
//   saveUninitialized: true
// }));
//
// var bulk_route_options = {require: function (middleware) {
//   require(middleware).create(app);
// }};
// bulk(__dirname, ['middleware/*.js'], bulk_route_options);
// bulk(__dirname, ['middleware/deffered/*.js'], bulk_route_options);
