'use strict';
process.title = 'node' + require('./package.json').name;

require('./config');
require('./logger.js');

if (!module.parent) {
  require('./gulpfile.js');
  require('gulp').start('default');
}
