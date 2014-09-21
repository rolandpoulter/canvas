'use strict';
/*jshint noyield:true*/

app.router.get('/config', function* () {
  this.body = config.client;
  yield null;
});
