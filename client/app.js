'use strict';

global.app = exports;

app.$ = global.jQuery;
app.events = global.events;

app.model = require('./model.js');

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
  app.io = require('./io.js');
  app.ui = require('./ui.js');
}
