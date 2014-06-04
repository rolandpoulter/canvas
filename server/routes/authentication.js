var passport = require('passport');

exports.create = function (app) {
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

	app.get('/logout', function (request, response){
  	request.logout();
	  response.redirect('/');
	});
};
