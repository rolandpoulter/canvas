'use strict';

var logger = Object.create(console);

if (!global.logger) global.logger = logger;

module.exports = logger;

if (typeof process === 'object' && process.title) {// Node.JS Only
  logger.useGulpUtilLogger = function () {
    logger._log = logger.log;
    logger.log = require('gulp-util').log;
  };

  logger.restoreDefaultLogger = function () {
    logger.log = logger._log;
    delete logger._log;
  };
}
