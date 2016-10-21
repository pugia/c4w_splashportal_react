var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var minify = require('gulp-minify');
var sass = require('gulp-sass');

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

function watch() {
  compile(true);
  sass_task();
};

function sass_task() {
  return gulp.src('./public/css/*.scss')
    .pipe(sass.sync({
      outputStyle: 'compressed',
      environment: 'production'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
}

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);

/* SASS */
gulp.task('sass', function () { return sass_task(); });
gulp.watch('./public/css/*.scss', ['sass']);

