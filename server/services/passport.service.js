var passport = require('passport'),
	passportLocal = require('passport-local'),
	bcrypt = require('bcrypt'),
	userService = require('../services/user.service');

module.exports = function() {
	passport.use(new passportLocal.Strategy( {usernameField: 'email'}, 
		function(email, password, next) {
			userService.findUser(email, function(err, user) {
				if(err) {
					return next(err, null);
				}
				if(!user) {
					return next(null, null);
				}
				bcrypt.compare(password, user.password, function(err, same) {
					if(err) {
						next(err);
					}
					if(!same) {
						next(null, null);
					};
					userService.loginUser(user);
					return next(null, user);
				});
			});
		}
	));

	passport.serializeUser(function(user, next) {
		next(null, user.email);
	});

	passport.deserializeUser(function(email, next) {
		userService.findUser(email, function(err, user) {
			next(err, user);
		});
	});
};