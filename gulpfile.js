'use strict';

var distPath, srcPath, assetsPath, gulp, sass, autoprefixer, browserSync, sourcemaps, version;

gulp = require('gulp');
sass = require('gulp-sass');
autoprefixer = require('gulp-autoprefixer');
version = require('gulp-version-number');

srcPath = function (path) {
  return './src/' + path;
};

distPath = function (path) {
  return './public/' + path;
};

gulp.task('build:html', function () {
  gulp.src(srcPath('*.html'))
    .pipe(version({
      'value': '%TS%',
      'append': {
        'key': '_v',
        'cover': 1,
        'to': ['css', 'js']
      }
    }))
    .pipe(gulp.dest(distPath('')));
});

gulp.task('build:scss', function () {
  gulp.src(srcPath('scss/**/*.scss'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(distPath('assets/css')));
});

gulp.task('build:js', function () {
  gulp.src(srcPath('js/**/*.*'))
    .pipe(gulp.dest(distPath('assets/js')));
});

gulp.task('build:static', function () {
  gulp.src(srcPath('fonts/**/*.*'))
    .pipe(gulp.dest(distPath('assets/fonts')));
  gulp.src(srcPath('img/**/*.*'))
    .pipe(gulp.dest(distPath('assets/img')));
  gulp.src(srcPath('video/**/*.*'))
    .pipe(gulp.dest(distPath('assets/video')));
});

gulp.task('build', ['build:scss', 'build:js', 'build:html', 'build:static'], function () {
});

gulp.task('default', ['build'], function () {
});

if (!process.env.NODE_ENV && process.env.NODE_ENV != 'production' ) {

  browserSync = require('browser-sync').create();
  sourcemaps = require('gulp-sourcemaps');

  gulp.task('browser-sync', function () {
    return browserSync.init({
      proxy: "localhost:5000"
    });
  });

  gulp.task('html', function () {
    gulp.src(srcPath('*.html'))
      .pipe(version({
        'value': '%TS%',
        'append': {
          'key': '_v',
          'cover': 1,
          'to': ['css', 'js']
        }
      }))
      .pipe(gulp.dest(distPath('')))
      .pipe(browserSync.stream());
  });

  gulp.task('scss', function () {
    gulp.src(srcPath('scss/**/*.scss'))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest(distPath('assets/css')))
      .pipe(browserSync.stream());
  });

  gulp.task('js', function () {
    gulp.src(srcPath('js/**/*.*'))
      .pipe(gulp.dest(distPath('assets/js')))
      .pipe(browserSync.stream());
  });

  gulp.task('static', function () {
    gulp.src(srcPath('fonts/**/*.*'))
      .pipe(gulp.dest(distPath('assets/fonts')));
    gulp.src(srcPath('img/**/*.*'))
      .pipe(gulp.dest(distPath('assets/img')));
    gulp.src(srcPath('video/**/*.*'))
      .pipe(gulp.dest(distPath('assets/video')));
  });

  gulp.task('watch', function () {
    gulp.watch(srcPath('**/*.html'), ['html']);
    gulp.watch(srcPath('scss/**/*.scss'), ['scss']);
    gulp.watch(srcPath('js/**/*.*'), ['js']);
  });

  gulp.task('default', ['browser-sync', 'scss', 'js', 'html', 'static', 'watch'], function () {
  });

}
