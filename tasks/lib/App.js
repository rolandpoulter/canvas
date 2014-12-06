'use strict';

var events = require('events'),
    ehancedRequire = require('enhanced-require'),
    https = require('https'),
    http = require('http'),
    koa = require('koa'),
    koala = require('koala'),
    util = require('util');

require('../../config');
require('../../logger.js');

module.exports = App;

util.inherits(App, events.EventEmitter);

App.error = function App_error(err) {
  logger.error(err.stack || err);
  process.nextTick(process.exit.bind(process, 1));
};

function App(domain) {
  if (global.app) throw new Error('Application already created.');

  global.app = this;

  events.EventEmitter.call(this);

  if (config.server.koa)
    this.base = koa();

  else
    this.base = koala({
      session: false,
      fileServer: {
        root: config.server.static_path,
        index: true,
        hidden: true,
        maxage: config.server.static_max_age || 0
      }
    });

  this.domain = domain || null;
}

App.prototype.corret = function () {
  delete this._error;
};

App.prototype.error = function (error) {
  this._error = error || true;
  this.emit('error', error);
  if (this._error) App.error(error);
};

App.prototype.run = function () {
  logger.log('Running application:', config.package.name,
                         'version:', config.package.version);

  this.load();
  this.setup();

  return this.listen.bind(this);
};

App.prototype.load = function () {
  this.emit('before_load');

  var appRequire;

  if (config.server.app.entry_path) {
    if (!config.server.app.hot_code)
      require(config.server.app.entry_path);

    else ehancedRequire(
      module,
      {
        substitutions: config.server.app.enhanced_require_substitutions,
        recursive: config.server.app.enhanced_require_recursive,
        resolve: {
          loaders: config.webpack.module.loaders
        },
        watch: config.server.app.enhanced_require_watch,
        hot: config.server.app.enhanced_require_hot
      }
    )(config.server.app.entry_path);
  }

  this.emit('after_load');
};

App.prototype.setup = function () {
  this.emit('before_setup');

  this.server = config.server.ssl ?
    https.createServer(config.server.ssl, this.base.callback()) :
    http.createServer(this.base.callback());

  this.emit('after_setup');
};

App.prototype.listen = function () {
  this.emit('before_listen');

  logger.log('#' + process.pid + ' - ' +
             config.server.host + ':' +
             config.server.port);

  this.server.listen(
    config.server.port,
    config.server.host,
    this.emit.bind(this, 'after_listen'));
};
// 
// baseMethod('use');
//
// function baseMethod(method) {
//   App.prototype[method] = function () {
//     return this.base[method].apply(this, arguments);
//   };
// }
