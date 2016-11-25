const gulp              = require('gulp');
const sass              = require('gulp-sass');
const sourcemaps        = require('gulp-sourcemaps');
const autoprefixer      = require('gulp-autoprefixer');
const notify            = require('gulp-notify');
const browserSync       = require('browser-sync');
const reload            = browserSync.reload;

function handleErrors() {
  let args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

gulp.task('sass', () => {
  // - Compile main.scss
  gulp.src('app/assets/stylesheets/**/*.scss')
    // load and init sourcemaps
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['app/assets/stylesheets/', 'node_modules/bootstrap-sass/assets/stylesheets/']
    }).on('error', handleErrors))
    // - Auto prefix will add vendor prefixes to CSS rules based on options below
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // - Write source maps
    .pipe(sourcemaps.write())
    // - Standard desitination for main.css
    .pipe(gulp.dest('./public/assets/stylesheets/'))
    .pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'http://platform.dev:3000/',
    open: false
  });
});


gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch('./app/assets/stylesheets/**/*.scss', ['sass']);
});
