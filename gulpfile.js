// load the plugins
var gulp       = require('gulp');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

// minify and concat angular files (cannot be done as standard js files due to angular restrictions)
gulp.task('angular', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
         .pipe(ngAnnotate())
         .pipe(concat('app.js'))
         .pipe(uglify())
         .pipe(gulp.dest('public/dist'));
});