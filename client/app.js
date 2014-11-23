'use strict';

global.onerror = null;

global.app = exports;

app.$ = global.jQuery;
app.events = global.events;

global.React.initializeTouchEvents(true);

app.io = {};
app.ui = {};

global.jQuery.ajax({
  url: '/config',
  success: function (config) {
    app.config = config;

    require('./ws.js');

    app.onSession(initApp);
  },
  error: function () {
    console.error('Unable to get client config.');
  }
});

function initApp() {
  if (app.initialized) return;

  app.initialized = true;

  // global.React.unmountComponentAtNode(global.document.body);

  require('./ui/canvas_view.jsx').safeRender({
    parent: global.document.body,
    initialX: 0,
    initialY: 0,
    initialScale: 1,
    tileOptions: {}
  });
}
