'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;



var path = {
    build: {
        html: 'app/build/',
        js: 'app/build/js/',
        css: 'app/build/css/',
        img: 'app/build/assets/',
        fonts: 'app/build/fonts/'
    },
    src: {
        html: 'app/src/html/*.html',
        js: 'app/src/js/**/*.js',
        style: 'app/src/styles/*.scss',
        img: 'app/src/assets/**/*.*',
        fonts: 'app/src/fonts/**/*.*'
    },
    watch: {
        html: 'app/src/html/**/*.html',
        js: 'app/src/js/**/*.js',
        style: 'app/src/styles/*.scss',
        img: 'app/src/assets/**/*.*',
        fonts: 'app/src/fonts/**/*.*'
    },
    clean: './app/build'
};

var config = {
    server: {
        baseDir: "./app/build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "acsima_dev"
};

gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build'
]);
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);
