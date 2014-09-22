'use strict';

var passport = require('koa-passport');

app.router.post('/login', /*function* () {
	this.session.passport = this.session.passport || {};
},*/ passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/'
}));

app.router.get('/logout', function (request, response) {
	request.logout();
	response.redirect('/');
});
