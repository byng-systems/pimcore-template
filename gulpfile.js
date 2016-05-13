"use strict";

var autoprefixer = require("gulp-autoprefixer");
var browserify = require("browserify");
var browserSync = require("browser-sync").create();
var buffer = require("vinyl-buffer");
var concat = require("gulp-concat");
var gulp = require("gulp");
var gutil = require("gulp-util");
var minifyCss = require("gulp-minify-css");
var plumber = require("gulp-plumber");
var reload = browserSync.reload;
var sass = require("gulp-sass");
var source = require("vinyl-source-stream");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);

var paths = {
    src: {
        fonts: "src/fonts/**/*",
        images: "src/img/**/*",
        js: {
            vendors: [
                // Put vendor libraries here
                // "node_modules/jquery/dist/jquery.min.js"
            ],
            app: "src/js/scripts.js"
        },
        scss: "src/scss/styles.scss"
    },
    dst: {
        css: [
            "flats/css",
            "web/website/static/css"
        ],
        fonts: [
            "flats/fonts",
            "web/website/static/fonts"
        ],
        images: [
            "flats/img",
            "web/website/static/img"
        ],
        js: [
            "flats/js",
            "web/website/static/js"
        ]
    },
    watch: {
        scss: "src/scss/**/*.scss",
        js: "src/js/**/*.js",
        jsVendor: [
            "flats/lib/**/*.js",
            "web/website/lib/**/*.js"
        ]
    }
};

// Fonts

gulp.task("fonts", function() {
    gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dst.fonts[0]))
        .pipe(gulp.dest(paths.dst.fonts[1]));
});

// Iconfont

gulp.task('iconfont', function(){
  gulp.src(['src/images/icons/*.svg'])
    .pipe(iconfontCss({
        fontName: 'icons',
        path: 'src/scss/modules/_icons.scss',
        targetPath: '../../../../src/scss/mixins/_icon.scss',
        fontPath: '/website/static/fonts/'
    }))
    .pipe(iconfont({
        fontName: 'icons',
        normalize: true,
        formats: ['ttf', 'eot', 'woff', 'svg'],
        timestamp: runTimestamp,
        fontHeight: 1001
     }))
    .pipe(gulp.dest('web/website/static/fonts'));
});

// Images

gulp.task("images", function() {
    gulp.src(paths.src.images)
        .pipe(gulp.dest(paths.dst.images[0]))
        .pipe(gulp.dest(paths.dst.images[1]));
});

// Sass

gulp.task("sass", function() {
    gulp.src(paths.src.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 2 versions", "ie >= 9"],
            cascade: false
        }))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dst.css[0]))
        .pipe(gulp.dest(paths.dst.css[1]))
        .pipe(browserSync.stream());
});

gulp.task("watch-sass", function() {
    gulp.watch(paths.watch.scss, ["sass"]);
});

// JS Vendor

gulp.task("js-vendor", function() {
    return gulp.src(paths.src.js.vendors)
        .pipe(plumber())
        .pipe(concat("vendor.js"))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dst.js[0]))
        .pipe(gulp.dest(paths.dst.js[1]))
        .on("end", reload);
});

gulp.task("watch-js-vendor", function() {
    gulp.watch(paths.watch.jsVendor, ["js-vendor"]);
});

// JS

gulp.task("js", function() {
    return browserify(paths.src.js.app)
        .bundle()
        .on("error", function(e) {
            gutil.log(e);
            this.emit("end");
        })
        .pipe(source("scripts.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dst.js[0]))
        .pipe(gulp.dest(paths.dst.js[1]))
        .on("end", reload);
});

gulp.task("watch-js", function() {
    gulp.watch(paths.watch.js, ["js"]);
});

// Main

gulp.task("watch", ["build", "watch-sass", "watch-js-vendor", "watch-js"]);

gulp.task("server", ["watch"], function() {
    browserSync.init({
        server: {
            baseDir: "./flats"
        }
    });

    gulp.watch(["flats/**/*.html"], browserSync.reload);
});

gulp.task("build", ["fonts", "iconfont", "images", "sass", "js-vendor", "js"]);

gulp.task("default", ["server"]);
