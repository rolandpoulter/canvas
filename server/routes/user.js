'use strict';
/*jshint noyield:true*/

app.router.get('/user', function* () {
  this.body = {};
  yield this.body;
});
