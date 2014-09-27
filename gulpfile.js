/* Variables / Environment Setup
---------------------------------------------------------------------------- */

// gulp requires
var gulp       = require('gulp'),
	gutil      = require('gulp-util'),
	livereload = require('gulp-livereload'),
	del        = require('del'),
	rsync      = require('rsyncwrapper').rsync,
	pngcrush   = require('imagemin-pngcrush'),
	secrets    = require('./secrets.json'),
	plugins    = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'gulp.*'],
		replaceString: /\bgulp[\-.]/
	});

// source / destination paths
var paths = {

	haml: {
		src : 'dev/haml/',
		dest: 'build/'
	},
	styles: {
		src : 'dev/styles/',
		dest: 'build/assets/css/'
	},
	scripts: {
		src : 'dev/scripts/*.js',
		vndr: 'dev/scripts/vendor/*.js',
		dest: 'build/assets/js/'
	},
	images: {
		src : 'dev/media/images/*.{png,jpg,gif}',
		dest: 'build/assets/img/'
	},
	svg: {
		src : 'dev/media/svg/*.svg'
	},
	extra: {
		dply : {
			prod : 'dev/extra/deploy/prod/*.*',
			stage: 'dev/extra/deploy/stage/*.*'
		},
		root : 'dev/extra/root/',
		dest : 'build/'
	}

};


// --dev flag variables
var isProduction = true,
	sassStyle    = 'compressed',
	sourceMap    = false,
	deployPath   = secrets.server.prod;

// run "gulp *task* --dev" for dev en output
if (gutil.env.dev === true) {
	isProduction = false;
	sassStyle    = 'expanded';
	sourceMap    = true;
	deployPath   = secrets.server.stage;
}


/* Gulp Tasks
---------------------------------------------------------------------------- */

// Delete all build files
gulp.task('clean', function(cb) {

	// deletes all files and files within folders, but keeps empty folder structure
	// should consider using an "Are You Sure?" prompt
	del(['build/assets/css/*.css', 'build/assets/img/*.*', 'build/assets/js/*.js', 'build/*.*', 'build/.htaccess'], cb);

});


// Compile only main HAML files (partials are included via the main files)
gulp.task('haml', function() {

	return gulp.src(paths.haml.src + '*.haml') // does not work: , {read: false}
		.pipe(plugins.rubyHaml()) // does not work: {doubleQuote: true}
		.pipe(gulp.dest(paths.haml.dest));

});


// Compile and Output Styles
gulp.task('styles', function() {

	return gulp.src(paths.styles.src + 'styles.scss')
		.pipe(plugins.rubySass({
			style: sassStyle,
			sourcemap: sourceMap,
			precision: 2
		}))
		.pipe(isProduction ? gutil.noop() : plugins.concat('styles.css')) // concat with sourcemap if --dev
		.pipe(plugins.autoprefixer('last 2 version'))
		.pipe(isProduction ? plugins.minifyCss() : gutil.noop()) // don't minify if --dev
		.pipe(gulp.dest(paths.styles.dest));

});


// Concat and Output Scripts
gulp.task('scripts', function() {

	return gulp.src(paths.scripts.src)
		.pipe(plugins.concat('scripts.js'))
		.pipe(isProduction ? plugins.uglify() : gutil.noop()) // don't uglify if --dev
		.pipe(gulp.dest(paths.scripts.dest));

});


// Check for changed image files and compress them
gulp.task('images', function() {
	return gulp.src(paths.images.src)
		.pipe(plugins.changed(paths.images.dest))
		.pipe(plugins.imagemin({
			optimizationLevel: 7,
			progressive: true,
			use: [pngcrush()] // very slow, but better compression
		}))
		.pipe(gulp.dest(paths.images.dest));
});


// Compress all svg files, combine them into a single file, inject contents into index.html
// need to manually run each time haml file is updated until a sequence gets added to gulp
gulp.task('svg', function() {

	var svgOutput = gulp.src(paths.svg.src)
						.pipe(plugins.imagemin({
							svgoPlugins: [{
								removeViewBox: false,
								removeUselessStrokeAndFill: false
							}]
						}))
						.pipe(plugins.svgstore({
							// prefix: 'icon-',
							inlineSvg: true,
							transformSvg: function(svg, cb) {
								svg.attr({
									id: 'master-vector',
									style: 'display:none'
								});
								cb(null);
							}
						}));

	function fileContents(filePath, file) {
		return file.contents.toString('utf8');
	}

	return gulp.src(paths.haml.dest + 'index.html')
				.pipe(plugins.inject(svgOutput, { transform: fileContents }))
				.pipe(gulp.dest(paths.haml.dest));

});


// Copy (if changed) all of our miscellaneous files to the build folder
gulp.task('extras', function() {

	return gulp.src([paths.extra.root + '*.*', paths.extra.root + '.htaccess'])
		.pipe(plugins.changed(paths.extra.dest)) // not sure how to check if this is working or not
		.pipe(gulp.dest(paths.extra.dest));

});


// Copy (if changed) all of our vendor scripts to the build/assets/js folder (does not work if part of extras...)
gulp.task('vendor', function() {

	return gulp.src(paths.scripts.vndr)
		.pipe(plugins.changed(paths.scripts.dest))
		.pipe(gulp.dest(paths.scripts.dest));

});


// To be run before 'deploy'... handles server specific files / injections (staging vs production: robots.txt, google analytics, etc.)
// ...curently assumes destination of build folder for files such as robots.txt
gulp.task('prepare', function() {

	// prepare our server specific files
	return gulp.src(isProduction ? paths.extra.dply.prod : paths.extra.dply.stage)
		// .pipe(plugins.changed(paths.extra.dest)) // not sure how to check if this is working or not
		.pipe(gulp.dest(paths.extra.dest));

});


// Use rsync to deploy to server (no need to exclude files since everything comes from 'build' folder)
// build/** and build/**/*.* do not seem to work anymore... in fact nothing seems to fucking work!
/*
gulp.task('deploy', function() {

	gulp.src(['build/.htaccess', 'build/index.html', 'build/assets/**'])
		.pipe(plugins.rsync({
			root: 'build',
			hostname: secrets.servers.prod.host,
			destination: secrets.servers.prod.dest,
			incremental: true,
			progress: true,
			recursive: true,
			clean: true,
			exclude: ['.DS_Store']
		}));

});
*/


// Use rsyncwrapper to deploy to server... since piece of ship gulp-rsync doesn't do a fucking thing!
// Consider using gulp-prompt to ask which server to deploy to
gulp.task('deploy', ['prepare'], function() {

	rsync({
		ssh: true,
		src: './build/',
		dest: secrets.server.host + ':' + deployPath,
		recursive: true,
		syncDest: true,
		exclude: ['.DS_Store'], // be sure to exclude sites folder and robots.txt... once you can fucking figure out how
		args: ['--verbose']
	}, function(error, stdout, stderr, cmd) {
		gutil.log(stdout);
	});

});


// Watch over specified files and run corresponding tasks...
// does not inject SVG... need better process for this
gulp.task('watch', ['haml', 'styles', 'scripts', 'extras', 'vendor'], function() {

	gulp.start('svg'); // apparently not a good approach

	// watch dev files, rebuild when changed
	gulp.watch(paths.haml.src + '**/*.haml', ['haml']);  // watch all HAML files, including partials (recursively)
	gulp.watch(paths.styles.src + '*.scss', ['styles']); // watch all SCSS files,  including partials
	gulp.watch(paths.scripts.src + '*.js', ['scripts']);

	// start livereload server and refresh page whenever build files are updated
	livereload.listen(); // errors with livereload?
	gulp.watch('build/**').on('change', livereload.changed);

});


// Default gulp task - requires HAML to be compiled before injecting SVG
// Should run gulp clean prior to running the default task
gulp.task('default', ['haml'], function() {

	gulp.start('styles', 'scripts', 'images', 'extras', 'vendor', 'svg'); // apparently not a good approach

});