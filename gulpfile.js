'use strict';

// load plugins
var $ = require('gulp-load-plugins')();

// manually require modules that won"t get picked up by gulp-load-plugins
var gulp = require('gulp'),
    del = require('del'),
    pkg = require('./package.json'),
    assemble = require('assemble');

// handle errors
var onError = function(error) {
    $.util.log($.util.colors.red('You fucked up:', error.message, 'on line' , error.lineNumber));
    this.emit('end');
}


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Config
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

var src      = 'src/',
    dist     = 'dist/';


// code banner
var banner = [
    '/**',
    '**',
    '** ------------------------------------------',
    '**',
    '**    <%= pkg.name %> v<%= pkg.version %>',
    '**    <%= pkg.homepage %>',
    '**    <%= pkg.license %> ',
    '**',
    '** ------------------------------------------',
    '**',
    '**/'
].join('\n');


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Tasks
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//
// Delete build artifacts
//
gulp.task('clean', function() {
    return del(dist + '**/*');
});


//
// HTML
//
gulp.task('html', function() {
    assemble.partials(src + 'partials/*.*');

    return gulp.src(src + '*.hbs')
        .pipe($.assemble(assemble))
        .pipe($.extname())
        .pipe(gulp.dest(dist))
        .pipe($.connect.reload());
});


//
// Styles
//
gulp.task('css', function() {
    return gulp.src(src + 'styl/appstorebadges.styl')
        .pipe($.stylus({ 'include css': true })).on('error', onError)
        .pipe($.autoprefixer({ browsers: ['last 2 versions', 'safari >= 5', 'firefox >= 21', 'ie 9', 'opera >= 12.1', 'ios >= 6', 'android >= 4'] }))
        .pipe($.cssmin())
        .pipe($.header(banner, { pkg: pkg }))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest(dist))
        .pipe($.connect.reload());
});


//
// Dev Server
//
gulp.task('connect', function() {
    return $.connect.server({
        root: [dist],
        livereload: true,
        port: 1337
    });
});


//
// Watch task
//
gulp.task('watch', function() {
    gulp.watch([src + '**/*.styl'], ['css']);
    gulp.watch([src + '**/*.{hbs,html}'], ['html']);
});


//
// Dev Server
//
gulp.task('default', ['css', 'html', 'watch', 'connect']);


//
// Full build
//
gulp.task('build', ['css', 'html']);
