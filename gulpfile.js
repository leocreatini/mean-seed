// Declare Variables
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    bowerfiles = require('main-bower-files');

var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    path = require('path'),
    app = express();

    // Passport
var expressSession = require('express-session'),
    connectMongo = require('connect-mongo'),
    passport = require('passport'),
    passportLocal = require('passport-local'),
    passportConfig = require('./server/services/passport.service');
    passportConfig();

    // Mongoose
var mongoose = require('mongoose'),
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
var EXPRESS_ROOT = './public',
    EXPRESS_PORT = process.env.PORT || 3000;


// Declare Functions
function onError(err){
    console.log(err);
    this.emit('end');
}

// Bower JS to Assets
gulp.task('bower-files-js', function() {
    var js = (/.*\.js$/i);
    return gulp.src(bowerfiles({filter: js}), {base: './bower_components'})
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/libs'));
});

// Bower CSS to Assets
gulp.task('bower-files-css', function() {
    var css = (/.*\.css$/i);
    return gulp.src(bowerfiles({filter: css}), {base: './bower_components'})
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/assets/libs'));
});

// Bower Fonts to Assets
gulp.task('bower-files-fonts', function() {
    var fonts = (/.*\.woff/i);
    return gulp.src(bowerfiles({filter: fonts}), {base: './bower_components'})
        .pipe(gulp.dest('./public/assets/libs'));
});

// Sass to CSS
gulp.task('sass', function() {
  return gulp.src(['./public/assets/css/*.sass', '!./public/assets/css/partials/_*.sass'], {style: 'compressed', sourcemap: true})
    .pipe(sourcemaps.init())
    .pipe(sass({indentedSyntax: true}))
    .on('error', onError)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/assets/css'))
    .pipe(livereload());
});

// JS Hint
gulp.task('jshint', function() {
    return gulp.src(['./public/**/*.js', './public/app/**/*.js', '!./public/assets/libs/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(livereload());
});

gulp.task('html', function() {
    gulp.src('./public/app/**/*.hmtl')
        .pipe(livereload());
});

// Gulp watching for changes.
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./public/assets/css/partials/*.sass'], ['sass']);
    gulp.watch(['./public/app/**/*.js', './public/app/*.js'], ['jshint']);
    gulp.watch('./public/app/**/*.html', ['html']);
});

// Express Server
gulp.task('server', function() {
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
});

// Start all tasks by typing 'gulp' in Bash, while in main directory.
gulp.task('default', ['bower-files-js', 'bower-files-css', 'bower-files-fonts', 'server', 'watch'], function() {});
