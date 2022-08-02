'use strict';

const gulp = require('gulp'),
    {watch, series, parallel, src, dest} = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;



const path = {
    build: {
        html: './app/build/',
        js: 'app/build/js/',
        css: 'app/build/css/',
        img: 'app/build/assets/',
        fonts: 'app/build/fonts/'
    },
    src: {
        html: './app/src/html/*.html',
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

const config = {
    server: {
        baseDir: "./app/build"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "dev"
};

function webserver() {
    browserSync(config);
}
function clean(cb){
    rimraf(path.clean, cb);
}

function HTMLBuild(){
    return src(path.src.html)
        .pipe(rigger())
        .pipe(dest(path.build.html))
        .pipe(reload({stream: true}));
}

function JSBuild(){
    return src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
}
function FontsBuild(){
    return src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
}
function StyleBuild(){
    return src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
}
const build = parallel([HTMLBuild, JSBuild, FontsBuild, StyleBuild]);



watch([path.watch.html], parallel(HTMLBuild));
watch([path.watch.style], parallel(StyleBuild));
watch([path.watch.js], parallel(JSBuild));
watch([path.watch.fonts], parallel(FontsBuild));

exports.clean = series(clean);
exports.default = parallel( [build, webserver]);