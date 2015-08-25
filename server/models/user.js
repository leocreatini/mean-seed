var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var userSchema = new Schema({
    email: {type: String, index: { unique: true } }, //private
    password: {type: String, required: true},
    username: {type: String, required: false},
    firstname: {type: String, required: false},
    lastname: {type: String, required: false},
    roles: {
        admin: {type: Boolean, default: false},
        user: {type: Boolean, default: true},
    }
});

// Creates the model and makes it available to other Node modules.
module.exports = mongoose.model('User', userSchema);