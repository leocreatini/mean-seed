var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path'),
	app = express();

	// Passport
var	expressSession = require('express-session'),
	connectMongo = require('connect-mongo'),
	passport = require('passport'),
	passportLocal = require('passport-local'),
	passportConfig = require('./server/services/passport.service');
	passportConfig();

	// Mongoose
var	mongoose = require('mongoose'),
	uriUtil = require('mongodb-uri'),
	dbConfig = require('./config/db'),
	connection = mongoose.connection,
	mongodbUri = process.env.MONGOLAB_URI || dbConfig.uri,
	mongooseUri = uriUtil.formatMongoose(mongodbUri),
	options = {
		server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
		replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
	};

var MongoStore = connectMongo(expressSession);

	// Directories & Ports
var	EXPRESS_ROOT = './public',
	EXPRESS_PORT = process.env.PORT || 3000;
	

// Initialize Express Addons
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(bodyParser.json());
app.use(methodOverride());

// Passports
app.use(expressSession({
		secret: 'change this secret to something else',
		saveUninitialized: false,
		resave: false,
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		})
	}
));
app.use(passport.initialize());
app.use(passport.session());


// Connect Mongoose to Database
mongoose.connect(mongooseUri);
connection.on('error', console.error.bind(console, 'Connection error.'));
connection.once('open', function() {
	// Load routes
	require('./server/routes')(app);
});

// Start server on EXPRESS_PORT 3000.
app.listen(EXPRESS_PORT);
console.log('Server is up on ' + EXPRESS_PORT);