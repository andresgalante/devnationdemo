var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass         = require('gulp-sass');
var gutil        = require('gulp-util');
var source       = require('vinyl-source-stream');
var watchify     = require('watchify');
var exorcist     = require('exorcist');
var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;

gulp.task('styles', function() {
      gulp.src('www/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./www/css/'))
        .pipe(reload({stream:true}));
});

// reload server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./www"
        }
    });
});

// copy
gulp.task('copy', function() {
   gulp.src('./node_modules/normalize.css/normalize.css')
   .pipe(gulp.dest('./www/css/'));
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

//Watch task
gulp.task('watch',function() {
    gulp.watch('www/sass/**/*.scss',['styles']);
    gulp.watch("www/**/*.html", ['bs-reload']);
    gulp.watch("www/**/*.js", ['bs-reload']);
});

// js input file
watchify.args.debug = true;
var bundler = watchify(browserify('./www/js/app.js', watchify.args));

// On updates recompile
bundler.on('update', bundle);

function bundle() {
  gutil.log('Compiling JS...');
  return bundler.bundle()
  .on('error', function (err) {
    gutil.log(err.message);
    browserSync.notify("Browserify Error!");
    this.emit("end");
  })
  .pipe(exorcist('www/js/dist/bundle.js.map'))
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./www/js/dist'))
  .pipe(browserSync.stream({once: true}));
}

/**
 * Gulp task alias
 */
gulp.task('bundle', function () {
    return bundle();
});

// deploys
gulp.task('default',  ['styles', 'copy', 'bundle', 'browser-sync','watch']);
