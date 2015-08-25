var mongoose = require('mongoose'),
    User = require('../models/user'),
    utils = require('./utility.service.js'),
    bcrypt = require('bcrypt'),
    userServices = require('./user.service.js');

exports.loginUser = function(user) {
    User.findOne({email: user.email}, function(err, foundCodename) {
        if (err) {
            console.log(err);
        } else {
            foundCodename.inspect[0].online = true;
        }
        foundCodename.save();
    });
};

exports.logoutUser = function(user) {
    User.findOne({email: user.email}, function(err, foundCodename) {
        if (err) {
            console.log(err);
        } else {
            foundCodename.inspect[0].online = false;
        }
        foundCodename.save();
    });
};

exports.register = function(user, next) {
    User.findOne( {email: user.email}, function(err, dbUser) {
        if (err)
            return next(err);
        if (dbUser) 
            return next(dbUser.email + ' is a duplicate.');

        // User not a duplicate, so add new user.
        bcrypt.hash(user.password, 10, function(err, hash) {
            var newUser = new User(
                {
                    inspect: {
                        codename: user.codename
                    },
                    codename: user.codename,
                    email: user.email,
                    password: hash,
                    currentOrg: ''
                }
            ); //newUser

            newUser.save(function(err) {
                if (err) { 
                    return next(err);
                } else { 
                    return next();
                }
            });
        }); //bcrypt
    }); //User.findOne
}; //addUser()

exports.findUser = function(userEmail, next) {
    User.findOne( {email: userEmail}, function(err, user) {
        if (err) {
            return next(err, null);
        }
        if (user) { // User was found
            var trimmedUser = {
                inspect: user.inspect[0],
                email: user.email,
                password: user.password
            }
            return next(null, trimmedUser);
        }
    });
}; //findUser()