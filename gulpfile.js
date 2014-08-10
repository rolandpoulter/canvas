'use strict';
var bulk = require('bulk-require');

var tasks = bulk(__dirname, './tasks/*.js', {
  require: function (task) {
    console.log(task);
    require(task);
  }
});

console.log(tasks);
