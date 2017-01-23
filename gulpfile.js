var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  changed = require('gulp-changed'),
  rev = require('gulp-rev'),
  browserSync = require('browser-sync'),
  del = require('del'),
  ngannotate = require('gulp-ng-annotate'),
  bower = require("gulp-bower");

//download libs
gulp.task('bower', function () {
  return bower();
});

gulp.task('jshint', function () {
  return gulp.src(['app/scripts/**/*.js', 'app/view/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function () {
  return del(['dist']);
});

// Default task
gulp.task('default', ['clean', 'bower'], function () {
  gulp.start('usemin','copyfonts', 'copyview');
});


gulp.task('usemin', ['jshint'], function () {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      css: [minifycss(), rev()],
      js: [ngannotate(), uglify(), rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copyview', function () {
  gulp.src('app/view/**/*.html')
    .pipe(gulp.dest('./dist/view'));
});

gulp.task('copyfonts', ['clean'], function () {
  gulp.src('bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
  gulp.src('bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

// Watch
gulp.task('watch', ['browser-sync'], function () {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);

  gulp.watch('app/view/**/*.*.js', ['usemin']);

  gulp.watch('app/view/**/*.html', ['copyview']);

});

gulp.task('browser-sync', ['default'], function () {
  var files = [
      'app/**/*.html',
      'app/styles/**/*.css',
      'app/images/**/*.png',
      'app/scripts/**/*.js',
      'app/view/**/*.js',
      'app/view/**/*.html',
      'dist/**/*.*',
      'dist/**/*.html',
      'dist/*.html'
   ];

  setTimeout(function () {
    browserSync.init(files, {
      server: {
        baseDir: "dist/",
        index: "index.html"
      }
    });
  }, 3600);
  
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);

});