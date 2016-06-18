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
    // gulp.watch("www/**/*.js", ['bs-reload']);
});

// js input file
watchify.args.debug = true;
var bundlers = [];
bundlers[0] = {
  watch: watchify(browserify('./www/js/1_canvas.js', watchify.args)),
  target: '1_canvas'
}
bundlers[1] = {
  watch: watchify(browserify('./www/js/2_mosaic.js', watchify.args)),
  target: '2_mosaic'
}

// On updates recompile
bundlers.forEach(function(bundler) {
  bundler.watch.on('update', function() {
    bundle(bundler)
  });
})

function bundle(bundler) {
  gutil.log('Compiling JS...');
  return bundler.watch.bundle()
  .on('error', function (err) {
    gutil.log(err.message);
    browserSync.notify("Browserify Error!");
    this.emit("end");
  })
  .pipe(exorcist('www/js/dist/'+bundler.target + '.bundle.js.map'))
  .pipe(source(bundler.target+'.bundle.js'))
  .pipe(gulp.dest('./www/js/dist'))
  .pipe(browserSync.stream({once: true}));
}

/**
 * Gulp task alias
 */
gulp.task('bundle', function () {
  bundlers.forEach(function(bundler) {
    return bundle(bundler);
  })
});

// deploys
gulp.task('default',  ['styles', 'copy', 'bundle', 'browser-sync','watch']);
