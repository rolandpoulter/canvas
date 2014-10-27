'use strict';

global.onerror = null;

global.app = exports;

app.$ = global.jQuery;
app.events = global.events;

app.io = {};
app.ui = {};

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
  require('./ws.js');

  require('./io/entity.js');
  require('./io/session.js');
  require('./io/view.js');
  require('./io/wall.js');

  require('./ui/canvas_scroll.jsx').safeRender({
    parent: global.document.body,
  });
}
