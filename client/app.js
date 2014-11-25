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

    app.onSession(function (session) {
      app.getEntityById(session.view_id, function (err, view) {
        if (view) session.view = view;

        initApp(session);
      });
    });
  },
  error: function () {
    console.error('Unable to get client config.');
  }
});

function initApp(session) {
  if (app.initialized) return;

  app.initialized = true;

  // global.React.unmountComponentAtNode(global.document.body);

  // console.log(session);

  var position = session.view && session.view.position;

  require('./ui/canvas_view.jsx').safeRender({
    parent: global.wall_io_canvas,
    initialX: position && position.x,
    initialY: position && position.y,
    initialScale: session.view && session.view.scale,
    tileOptions: {}
  });
}
