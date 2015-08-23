var gulp = require('gulp'),
  less = require('gulp-less'),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  gulpif = require('gulp-if'),
  transform = require('vinyl-transform'),
  path = require('path'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  ngAnnotate = require('gulp-ng-annotate'),
  liveReload = require('gulp-livereload'),
  watch = require('gulp-watch'),
  watchify = require('watchify'),
  moment = require('moment'),
  sourcemap = require('gulp-sourcemaps'),
  minify = require('gulp-minify-css'),
  source = require('vinyl-source-stream'),
  assign = require('lodash.assign'),
  gutil = require('gulp-util'),
  buffer = require('vinyl-buffer'),
  globby = require('globby'),
  through = require('through2'),
  reactify = require('reactify');
var compiledPath = './public/compiled';

gulp.task('less', function() {
  return gulp.src(['./public/stylesheets/**/*.less'])
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(minify())
    .pipe(sourcemap.write())
    .pipe(gulp.dest('./public/stylesheets/css'));
});

gulp.task('thirdparty', function() {
  var basePath = './bower_components/';
  return gulp.src([
      basePath + 'jquery/dist/jquery.js',
      basePath + 'bootstrap/dist/js/bootstrap.js'
    ])
    .pipe(concat('thirdparty.js'))
    .pipe(gulp.dest(compiledPath));
});

gulp.task('js', function() {
  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
  // turns the output bundle stream into a stream containing
  // the normal attributes gulp plugins expect.
    .pipe(source('app.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemap.init({
      loadMaps: true
    }))
    // Add gulp plugins to the pipeline here.
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemap.write('./'))
    .pipe(gulp.dest(compiledPath));

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(['./public/javascripts/**/*.js'], function(err, entries) {
    // ensure any errors from globby are handled
    if (err) {
      bundledStream.emit('error', err);
      return;
    }

    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream);
  });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
});

gulp.task('watch', function() {
  liveReload.listen();
  watch(['./views/**/*.js', './public/javascripts/**/*.js'],
    function() {
      gulp.start('js');
    });

  watch('./public/stylesheets/**/*.less', function() {
    gulp.start('less');
  });

});
