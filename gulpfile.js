const gulp = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
// const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const compress = require('compression');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminPngout = require('imagemin-pngout');
const imageminPngcrush = require('imagemin-pngcrush');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminOptipng = require('imagemin-optipng');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminGiflossy = require('imagemin-giflossy');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminGuetzli = require('imagemin-guetzli');
const imageminAdvpng = require('imagemin-advpng');
const imageminZopfli = require('imagemin-zopfli');
const concatCss = require('gulp-concat-css');
const concat = require('gulp-concat');
const rev = require('gulp-rev');
const notify = require("gulp-notify");
const svgSprite = require('gulp-svg-sprite');
const tinypng = require('gulp-tinypng');
const extractMedia = require('gulp-extract-media-queries');

gulp.task('mediaq', () => {
    return gulp.src('dest/skin/frontend/adaptive/default/css/main.css')
        .pipe(extractMedia())
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/css/mq'));
});
const svgSpriteConfig = {
    mode: {
        view: { // Activate the «view» mode
            bust: false,
            render: {
                less: true // Activate Sass output (with default options)
            }
        },
        symbol: true
    }
};

gulp.task('compress-img', () => gulp.src('sound/**/*').pipe(imagemin(
    [
        // imageminGifsicle(),
        // imageminJpegtran({
        //     progressive: false
        // }),
        imageminJpegoptim({
            progressive: false
        }),
        imageminMozjpeg({
            progressive: false,
            quality: '97',
            smooth: 0
        }),

        // imageminGuetzli({
        //     quality: 95,
        // }),

        imageminPngout(),
        imageminOptipng(),
        imageminPngquant({
            quality: '75-90',
            speed: 1,
            dithering: 1
        }),
        imageminAdvpng()
    ], {
        verbose: true
    }
)).pipe(gulp.dest('sound_test')));

gulp.task('boot-build', () => {
    return gulp.src('src/bootstrap/bootstrap.less')
        .pipe(less())
        .pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
        .pipe(gcmq())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/css'));
});

gulp.task('boot-select', () =>  {
    return gulp.src('src/less/bootstrap-select.less')
        .pipe(less())
        .pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
        .pipe(gcmq())
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/css'));
});

gulp.task('less-build', () => {
    return gulp.src('src/less/main*.less')
        .pipe(less())
        .pipe(gcmq())
        .pipe(autoprefixer({
            browsers: [
                'Chrome >= 45',
                'Firefox ESR',
                'Edge >= 12',
                'Explorer >= 9',
                'iOS >= 9',
                'Safari >= 7',
                'Android >= 4.4',
                'Opera >= 30'
            ],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: {
                1: {
                    all: true
                }
            }
        }))
        .on("error", notify.onError({
            message: 'cleanCSS error: <%= error.message %>'
        }))
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/css'))
        .pipe(browserSync.stream());
});

gulp.task('less-dev', function () {
    console.log('LESS COMPILE STARTED');
    return gulp.src('src/less/main*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
        .on("error", notify.onError({
            message: 'LESS compile error: <%= error.message %>'
        }))
        .pipe(sourcemaps.write('./maps', {includeContent: true, sourceRoot: 'src/less'}))
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/css')).pipe(browserSync.stream());
});

gulp.task('concat-css', function() {
    return gulp.src(
        [
            'dest/skin/frontend/adaptive/default/css/bootstrap.css',
            'dest/skin/frontend/adaptive/default/css/bootstrap-select.css',
            'dest/skin/frontend/adaptive/default/css/main.css',
            'dest/skin/frontend/adaptive/default/css/jquery.fancybox.min.css',
            // 'dest/skin/frontend/adaptive/default/css/jquery-ui.structure.css',
            // 'dest/skin/frontend/adaptive/default/css/jquery-ui.theme.css'
        ])
        .pipe(gcmq())
        .pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
        .pipe(concatCss('main.css'))
        .pipe(cleanCSS({
            level: {
                1: {
                    all: true
                }
            }
        }))
        .pipe(rev())
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/css'));
});

gulp.task('concat-js', function() {
    return gulp.src(
        [
            'dest/skin/frontend/adaptive/default/js/slick.min.js', //41
            'dest/skin/frontend/adaptive/default/js/hammer.min.js', //21
            'dest/skin/frontend/adaptive/default/js/jquery.hammer.js', //1
            'dest/skin/frontend/adaptive/default/js/bootstrap.min.js', //37
            'dest/skin/frontend/adaptive/default/js/bootstrap-select.js', //33
            'dest/skin/frontend/adaptive/default/js/jquery.menu-aim.js', //6
            'dest/skin/frontend/adaptive/default/js/jquery.fancybox.min.js', //51
            'dest/skin/frontend/adaptive/default/js/nouislider.min.js', //22
            'dest/skin/frontend/adaptive/default/js/validate/jquery.validate.min.js', //23
            'dest/skin/frontend/adaptive/default/js/validate/messages_ru.min.js', //2
            'dest/skin/frontend/adaptive/default/js/validate/jquery.maskedinput.min.js', //5
            'dest/skin/frontend/adaptive/default/js/masonry.pkgd.min.js', //24
            'dest/skin/frontend/adaptive/default/js/lozad.min.js', //2
            'dest/skin/frontend/adaptive/default/js/jquery.countdown.min.js' //5
        ])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/js'));
});

// Static server
gulp.task('browser-sync-dev', function() {
    browserSync.init({
        server: {
            baseDir: 'dest',
            // middleware: function(req, res, next) {
            //     var gzip = compress();
            //     gzip(req, res, next);
            // },
            directory: true
        },
        // host: 'dev.mzv',
        // ghostMode: false,
        open: false
    });
    gulp.watch('src/less/**/*.less', ['less-dev']);
    gulp.watch('src/**/*.html', ['fileinclude']);
    browserSync.watch('src/**/*.*').on('change', browserSync.reload);
});

gulp.task('browser-sync-build', function() {
    browserSync.init({
        server: {
            baseDir: 'dest',
            // middleware: function(req, res, next) {
            //     var gzip = compress();
            //     gzip(req, res, next);
            // },
            directory: true
        },
        host: 'dev.mzv',
        ghostMode: false,
        open: false
    });
    gulp.watch('src/less/**/*.less', ['less-build']);
    gulp.watch('src/**/*.*', ['fileinclude']);
    browserSync.watch('src/**/*.*').on('change', browserSync.reload);
});

gulp.task('css-build', function() {
    return gulp.src('src/less/main-*.less')
        .pipe(less())
        .pipe(gcmq())
        .pipe(autoprefixer({
            browsers: [
                'Chrome >= 45',
                'Firefox ESR',
                'Edge >= 12',
                'Explorer >= 9',
                'iOS >= 9',
                'Safari >= 7',
                'Android >= 4.4',
                'Opera >= 30'
            ],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: {
                1: {
                    all: true
                }
            }
        }))
        // .pipe(cleanCSS())
        .pipe(gulp.dest('dest/skin/frontend/adaptive/default/css'));
});

gulp.task('fileinclude', function () {
    gulp.src(['src/index.html'])
        .pipe(fileinclude({prefix: '@@', basepath: '@file'}))
        .on("error", notify.onError({
            message: 'FILEINCLUDE error: <%= error.message %>'
        }))
        .pipe(gulp.dest('dest/'))
        .pipe(browserSync.stream());
});

gulp.task('svg-sprite', function () {
    gulp.src('src/img/delivery/*.svg')
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest('dest/img/delivery'));
});

gulp.task('dev', ['browser-sync-dev']);
gulp.task('build', ['less-build', 'fileinclude', 'browser-sync-build']);
gulp.task('tinypng', function () {
	gulp.src(['media/**/*.png', 'media/**/*.jpg'])
		.pipe(tinypng('5hh4jjdVjjqJlrpZkW56Q011C5ZqhY24'))
		.pipe(gulp.dest('compressed_images'));
});
