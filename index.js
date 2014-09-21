'use strict';
process.title = 'node' + require('./package.json').name;

require('./gulpfile.js');
require('gulp').start('default');
