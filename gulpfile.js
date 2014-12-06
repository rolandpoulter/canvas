'use strict';

var gulp = require('gulp');

require('./config');
require('./logger.js');

exports.main = main;

require('./tasks/build.js');
require('./tasks/compile_less.js');
require('./tasks/default.js');
require('./tasks/server_app.js');
require('./tasks/server_worker.js');
require('./tasks/server_cluster.js');
require('./tasks/watch.js');
require('./tasks/webpack_client.js');

if (!module.parent) main();

function main(args) {
  args = args || process.argv.slice(2).join();

  try {return gulp.start(args || 'default');}

  catch (err) {error(err);}
}

function error(err) {
  logger.error(err.stack || err);
  process.nextTick(process.exit);
}
