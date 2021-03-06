var gulp 			= require('gulp');
var gutil 		= require('gulp-util');
var jshint 		= require('gulp-jshint');
var concat 		= require('gulp-concat');
var clean 		= require('gulp-clean');
var uglify 		= require('gulp-uglify');
var rename 		= require('gulp-rename');
var less 			= require('gulp-less');
var nodemon 	= require('gulp-nodemon');
var plumber 	= require('gulp-plumber');

// Default task - watches
gulp.task('default', ['watch']);

// Build umbrella task
gulp.task('build', ['clean'], function () {
	gulp.start('server-side');
	gulp.start('public-side');
});

gulp.task('server-side', ['node-build', 'jade-build']);

gulp.task('public-side', ['js-build', 'img-build', 'font-build', 'font-css-build', 'less-build', 'bower-build']);

gulp.task('bower-build', ['bower-copy', 'angular-build', 'js-concat-form', 'fontawesome-build']);

// Cleans deploy folder
gulp.task('clean', function () {
	return gulp.src('dist/')
		.pipe(clean());
});

// Copy templates
gulp.task('jade-build', function () {
	return gulp.src('src/server/views/**/*.jade')
		.pipe(gulp.dest('dist/server/views'));
});

// Building front-end JS for deployment
gulp.task('js-build', function () {
	return gulp.src('src/public/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		//.pipe(uglify())
		.pipe(gulp.dest('dist/public/js'));
});

// Copy images
gulp.task('img-build', function () {
	return gulp.src('src/public/images/**/*.*')
		.pipe(gulp.dest('dist/public/images'));
});

// Copy icon font
gulp.task('font-build', function () {
	return gulp.src('src/public/webfont/fonts/*.*')
		.pipe(gulp.dest('dist/public/css/fonts'));
});

// Copy icon css
gulp.task('font-css-build', function () {
	return gulp.src('src/public/webfont/styles.css')
		.pipe(concat('webfont.css')) // this is what was missing
		.pipe(gulp.dest('dist/public/css'));
});

gulp.task('less-build', function () {
	return gulp.src('src/public/less/style.less')
		.pipe(plumber({
			errorHandler: function (error) {
				gutil.log(
					gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
					error.toString()
				);
				this.emit('end');
			}
		}))
		.pipe(less())
		// ... more pipes ...
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/public/css'));
});


// Moving bower packages for deployment
// TODO(Nick): Bower components can  be re-routed with a .bowerrc file to another location.
gulp.task('bower-copy', function () {
    gulp.src('bower_components/angular-loading-bar/build/loading-bar.min.css')
        .pipe(gulp.dest('dist/public/css'));
    gulp.src('bower_components/angular-native-picker/build/themes/*.css')
        .pipe(rename({
            prefix: 'angular-datepicker-'
        }))
        .pipe(gulp.dest('dist/public/css'));
    gulp.src('bower_components/dropzone/dist/min/dropzone.min.css')
        .pipe(gulp.dest('dist/public/css'));
    gulp.src('bower_components/toastr/toastr.min.css')
        .pipe(gulp.dest('dist/public/css'));
    gulp.src('bower_components/toastr/toastr.min.js')
        .pipe(gulp.dest('dist/public/js'));
    gulp.src('bower_components/parsleyjs/src/parsley.css')
        .pipe(gulp.dest('dist/public/css'));
})

// Builds out angular dependencies
gulp.task('angular-build', function () {
    gulp.src('bower_components/angular/angular.min.js')
        .pipe(gulp.dest('dist/public/js'));

    gulp.src('bower_components/angular-resource/angular-resource.js')
        .pipe(gulp.dest('dist/public/js'));

    gulp.src('bower_components/angular-animate/angular-animate.min.js')
        .pipe(gulp.dest('dist/public/js'));

    gulp.src('bower_components/angular-route/angular-route.js')
        .pipe(gulp.dest('dist/public/js'));

    gulp.src('bower_components/angular-loading-bar/build/loading-bar.min.js')
        .pipe(gulp.dest('dist/public/js'));

    gulp.src('bower_components/angular-native-picker/build/angular-datepicker.js')
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('js-concat-form', function () {
	return gulp.src(['bower_components/angular-native-picker/build/angular-datepicker.js',
			  'bower_components/dropzone/dist/min/dropzone.min.js',
			  'bower_components/parsleyjs/dist/parsley.min.js'])
		.pipe(concat("form.js"))
		.pipe(gulp.dest('dist/public/js'));
});

gulp.task('fontawesome-build', function () {
	gulp.src('bower_components/fontawesome/css/font-awesome.min.css')
		.pipe(gulp.dest('dist/public/css'));
	gulp.src('bower_components/fontawesome/fonts/fontawesome-webfont.ttf')
		.pipe(gulp.dest('dist/public/fonts'));
	gulp.src('bower_components/fontawesome/fonts/fontawesome-webfont.woff')
		.pipe(gulp.dest('dist/public/fonts'));
	gulp.src('bower_components/fontawesome/fonts/fontawesome-webfont.woff2')
		.pipe(gulp.dest('dist/public/fonts'));
});

gulp.task('node-build', function () {
	return gulp.src(['src/server/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulp.dest('dist/server/'));
});

//Watcher task, monitors angular/node code to restart app and redeploy
gulp.task('watch', function () {
	gulp.watch('src/**/*', ['build']);
});
