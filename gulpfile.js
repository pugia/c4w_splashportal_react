var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var minify = require('gulp-minify');
var child = require('child_process');
var fs = require('fs');

function compile(watch) {
  var bundler = watchify(
    browserify('./app/main.js', { debug: true }).transform(babel)
  );

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(minify({
        ext:{
          min:'.min.js'
        }
      }))
      .pipe(gulp.dest('./public/build'))
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    })
    .on('end', function() {
      console.log('-> end');
    })
  }

  rebundle();
}

function compile_landing(watch) {
  var bundler = watchify(
    browserify('./app/landing.js', { debug: true }).transform(babel)
  );

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('landing.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(minify({
        ext:{
          min:'.min.js'
        }
      }))
      .pipe(gulp.dest('./public/build'))
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling landing...');
      rebundle();
    })
    .on('end', function() {
      console.log('-> end');
    })
  }

  rebundle();
}


function watch() {
  compile(true);
  compile_landing(true);
  sass_task();
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('server', function() {
  var server = child.spawn('node', ['server.js']);
  var log = fs.createWriteStream('log/server.log', {flags: 'a'});
  server.stdout.pipe(log);
  server.stderr.pipe(log);
});

gulp.task('default', ['server', 'watch']);

/* SASS */
var sass = require('gulp-sass');

var sass_watch = ['./style/**/*.scss', './style/*.scss']

function sass_task() {
  return gulp.src(sass_watch)
    .pipe(sass.sync({
      outputStyle: 'compressed',
      environment: 'production'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
}
gulp.task('sass', function () { return sass_task(); });
gulp.watch(sass_watch, ['sass']);

