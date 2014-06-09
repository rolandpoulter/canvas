'use strict';
var passport = require('passport');

exports.create = function (app) {
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/'
	}));

	app.get('/logout', function (request, response) {
		request.logout();
		response.redirect('/');
	});
};
