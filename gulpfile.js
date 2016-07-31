// load the plugins
var gulp       = require('gulp');
var minifyCSS  = require('gulp-clean-css');
var rename     = require('gulp-rename');
var jshint     = require('gulp-jshint');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon    = require('gulp-nodemon');

//CSS Minifying task
gulp.task('css', function() {
 // grab the less file, process the LESS, save to style.css
return gulp.src('public/assets/css/style.css')
	.pipe(minifyCSS())
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('public/assets/css'));
});

// JS Linting, Concatetnation and Uglifying task
gulp.task('scripts', function() {
return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(concat('all.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/dist'));
});

// JS LCU task for Angular files
gulp.task('angular', function() {
return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(ngAnnotate())
	.pipe(concat('app.js'))
	.pipe(uglify())
	.pipe(gulp.dest('public/dist'));
});


//Watch task
gulp.task('watch', function() {
	gulp.watch('public/assets/css/style.less', ['css']);
	gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['js', 'angular']);
});

//Nodemon task
gulp.task('nodemon', function() {
	nodemon({
		script: 'server.js',
		ext: 'js html'
	})
	.on('start', ['watch'])
	.on('change', ['watch'])
	.on('restart', function() {
		console.log('Restarted!');
	});
});

//Main task
gulp.task('default', ['nodemon']);