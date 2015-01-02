'use strict';

var commander = require('commander'),
    path = require('path');
var package_json = require('../package.json');

require('../logger.js');

// if (global.config)
//   logger.warn(new Error('Config already exists.'));

global.config = exports;

commander
  .version(package_json.version)
  .option('-e, --environment [env]',
    'Set config.environment to [env].')
  .option('-a, --hot_code',
    'Use hot code loading.')
  .option('-d, --debug',
    'Enable debugging.')
  .option('-c, --cluster [count]',
    'Cluster [count].', parseInt)
  .option('-s, --session_key [key]',
    'Set session key to [key].')
  .option('-e, --app_entry [path]',
    'Set the entry path for the app to [path]')
  .option('-k, --app_keys [keys]',
    'Set keys for the app to [keys]')
  .option('-n, --app_name [name]',
    'Set the name of the app to [name]')
  .option('-n, --less_paths [paths]',
    'Set the less paths to compile: [paths]')
  .option('-m, --max_age [max_age]',
    'Set the max age for static files: [max_age]', JSON.parse)
  .option('-s, --static_paths [paths]',
    'Set the less paths to compile: [paths]')
  .option('-l, --host [host]',
    'Set the server host to [host]')
  .option('-n, --port [port]',
    'Set the server port to [port]', parseInt)
  .parse(process.argv);

var app_envrionment =
  commander.environment ||
  process.env.NODE_ENV ||
  'development';

try {
  var target_environment = require('./' + app_envrionment + '.js');
  mixin(target_environment);
}

catch (error) {
  mixin({environment: app_envrionment});
}

exports.package = package_json;

// if (!module.parent) logger.log(config);

function mixin(imports) {
  /*jshint maxstatements:40*/
  imports = imports || {};

  assign('debug', false);

  if (commander.debug)
    global.config.debug = !global.config.debug;

  if (global.config.debug && !process.env.DEBUG)
    process.env.DEBUG = '*';

  assign('environment', 'default', app_envrionment);

  assign('client.debug', global.config.debug);
  assign('client.session_key', 'wall.id', commander.session_key);

  assign('server.app.entry_path',
    path.join(__dirname, '..', 'server', 'app.js'),
    commander.app_entry);

  assign('server.app.keys',
    ['wall-io-canvas_key_1', 'key_canvas-io-wall_2'],
    commander.app_keys && commander.app_keys.split(','));

  assign('server.app.name', 'wall-io-canvas', commander.app_name);

  assign('server.app.less_paths',
    [path.join(__dirname, '..', 'node_modules', 'bootstrap', 'less')],
    commander.less_paths && commander.less_paths.split(','));

  assign('server.app.static_max_age', 0, commander.static_max_age);
  assign('server.app.static_path',
    path.join(__dirname, '..', 'static'),
    commander.static_path);

  assign('server.app.hot_code', true, !commander.hot_code);

  assign('server.app.enhanced_require_substitutions', {
    'jugglingdb-mongodb': require('jugglingdb-mongodb') // Hack
  });

  assign('server.app.enhanced_require_recursive', true);
  assign('server.app.enhanced_require_watch', true);
  assign('server.app.enhanced_require_hot', true);

  var expire_time = 1000 * 60 * 60 * 24 * 7; // 1 week
  assign('server.app.session', {
    ttl: expire_time,
    key: 'wall.id',
    prefix: 'wall.sess:',
    defer: true,
    rolling: false,
    allowEmpty: true,
    cookie: {
      path: '/',
      maxAge: expire_time,
      signed: false,
      secure: false,
      httpOnly: false,
      overwrite: true,
      secureProxy: false
    }
  });

  assign('server.host', '0.0.0.0', commander.server_host);
  assign('server.port',      3000, commander.server_port);

  assign('server.cluster', 3, commander.cluster);
  assign('server.ssl', null);
  assign('server.koa', false);

  assign('task.less_src', './client/css/*.less', commander.less_src);
  assign('task.less_dest', './static/css');
  assign('task.webpack_src', './client/index.js');
  assign('task.webpack_dest', './static/js');

  assign('webpack.name', 'client');
  assign('webpack.devtool', '');
  assign('webpack.debug', false);
  assign('webpack.cache', false);
  assign('webpack.entry',
    [path.join(__dirname, '..', 'client', 'index.js')]);
  assign('webpack.output.path',
    path.join(__dirname, '..', 'static', 'js'));
  assign('webpack.output.filename', 'client.js');
  assign('webpack.module.loaders', [
    {test: /\.coffee$/, loader: 'coffee-redux-loader'},
    {test: /\.jsx$/,    loader: 'react-hot!jsx' +
                                '?harmony&insertPragma=React.DOM'},
    {test: /\.json$/,   loader: 'json-loader'},
    {test: /\.json5$/,  loader: 'json5-loader'},
    {test: /\.txt$/,    loader: 'raw-loader'},
    {test: /\.html$/,   loader: 'html-loader'},
    {test: /\.md$/,     loader: 'html-loader!markdown-loader'},
    {test: /\.ms$/,     loader: 'mustache-loader'},
    {test: /\.png$/,    loader: 'url-loader'},
    {test: /\.obj$/,    loader: 'file-loader'},
    {test: /\.css$/,    loader: 'style-loader!css-loader'}
  ]);
  assign('webpack.pugins', []);

  function assign(name, default_value, override) {
    var context = imports,
        target = global.config,
        names = name.split('.'),
        last_property = names.pop();

    names.forEach(function (property) {
      context = context.hasOwnProperty(property) ?
        context[property] :
        context[property] = {};

      target = target.hasOwnProperty(property) ?
        target[property] :
        target[property] = {};
    });

    target[last_property] = default_value;

    if (context && context.hasOwnProperty(last_property))
      target[last_property] = context[last_property];

    if (override !== undefined)
      target[last_property] = override;

    context[last_property] = target[last_property];

    if (global.config.debug)
      logger.log('Config', name + ':', target[last_property]);
  }
}
