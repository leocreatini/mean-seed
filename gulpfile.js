// Declare Variables
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    bowerfiles = require('main-bower-files');

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
    .pipe(connect.reload());
});

// JS Hint
gulp.task('jshint', function() {
    return gulp.src(['./public/**/*.js', './public/app/**/*.js', '!./public/assets/libs/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    gulp.src('./public/app/**/*.hmtl')
        .pipe(connect.reload());
});

// Gulp watching for changes.
gulp.task('watch', function() {
    gulp.watch(['./public/assets/css/partials/*.sass'], ['sass']);
    gulp.watch(['./public/app/**/*.js', './public/app/*.js'], ['jshint']);
    gulp.watch('./public/app/**/*.html', ['html']);
});

gulp.task('connect', function() {
    connect.server(
        {
            livereload: true,
            root: 'public'
        }
    ); //connect()
});

// Start all tasks by typing 'gulp' in Bash, while in main directory.
gulp.task('default', ['bower-files-js', 'bower-files-css', 'bower-files-fonts', 'connect', 'watch'], function() {
});