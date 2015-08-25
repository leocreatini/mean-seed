var mongoose = require('mongoose')
    path = require('path');

module.exports = function(app) {

    // Backend Routing
    /* USERS */
    require('./routes/users.route.js')(app);

    // Frontend Routing
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../public', '/index.html'));
    });

}; // App
