'use strict';
var app = global.app = {};

app.$ = global.jQuery;
app.events = global.events;

app.model = require('bulk-require')(__dirname, ['model/**/*.js']).model;

global.jQuery.ajax({
  url: '/config',
  success: function (config) {
    app.config = config;
    initApp();
  },
  error: function () {
    console.error('Unable to get client config.');
  }
});

function initApp() {
  require('./io');
  require('./ui');
}
