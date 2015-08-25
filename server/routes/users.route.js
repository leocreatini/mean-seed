var mongoose = require('mongoose'),
    dbConfig = require('../../config/db'),
    userService = require('../services/user.service.js'),
    passport = require('passport');

module.exports = function(router) {
    // LOGIN
    router.post('/login', passport.authenticate('local'), function(req, res, next) {
        if(req.body.rememberMe) {
            req.session.cookie.maxAge = dbConfig.sessionMaxAge;
        }
        res.send(req.user);
    });

    // LOGOUT
    router.post('/logout', function(req, res, next) {
        userService.logoutUser(req.user);
        req.logout();
        res.send('Logged out.');
    });

    // REGISTER
    router.post('/register', function(req, res) {
        userService.register(req.body, function(err) {
            if (err) {
                console.log("There was an error."); //REMOVE THIS WHEN DONE TESTING
                res.send(err);
            } else {
                req.login(req.body, function(err) {
                    console.log("Logging new user in."); //REMOVE THIS WHEN DONE TESTING
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(req.user);
                    }
                }); //login
            }
        }); //register
    });

    // GET
    router.get('/api/users', function(req, res){
        if (req.user) {
            userService.findUser(req.user.email, function(err, foundUser) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.status(200).send(foundUser); 
                }
            });
        } else {
            res.status(404).send(null);
        }
        
    });


    // PUT
    router.put('/api/users/:email', function(req, res) {
        userService.updateUser(req.params, req.body, function(err, updatedUser) {
            if (err) {
                res.send(err);
            } else {
                res.send(updatedUser);
            }
        });
    });

    // DELETE
    router.delete('/api/users/:email', function(req, res) {
        userService.deleteUser(req.params, function(err) {
            if(err) {
                res.send(err);
            } else {
                res.send('User deleted.');
            }
        });
    });

}; //exports