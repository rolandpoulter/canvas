'use strict';

var passport = require('koa-passport');

app.router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/'
}));

app.router.get('/logout', function (request, response) {
	request.logout();
	response.redirect('/');
});
