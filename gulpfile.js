/* Variables / Environment Setup
---------------------------------------------------------------------------- */

// gulp requires
var gulp       = require('gulp'),
	// del        = require('del'),
	// cheerio    = require('cheerio'), // used by gulp-svgstore for transforms
	pngcrush   = require('imagemin-pngcrush'),
	// gutil = require('gulp-util'), // does it make sense to define this outside of load-plugins?
	// livereload = require('gulp-livereload'), // does it make sense to define this outside of load-plugins?
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
		// vndr: 'dev/scripts/vendor/*.js',
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
		root : 'dev/extra/root/',
		dest : 'build/'
	}

};


/* Gulp Tasks
---------------------------------------------------------------------------- */
// Compile only main HAML files (partials are included via the main files)
gulp.task('haml', function() {

	return gulp.src(paths.haml.src + '*.haml')
		.pipe(plugins.rubyHaml())
		.pipe(gulp.dest(paths.haml.dest))
		.pipe(plugins.livereload());

});


// Compile and Output Styles
gulp.task('styles', function() {

	return plugins.rubySass(paths.styles.src + 'styles.scss', {
			sourcemap: false // true
		})
		// .pipe(plugins.sourcemaps.write())
		// .pipe(plugins.concat('styles.css')) // concat with sourcemap if --dev
		.pipe(plugins.autoprefixer({
			browsers: ['last 3 version', 'ios 6', 'android 4']
		}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(plugins.minifyCss()) // don't minify if --dev
		.pipe(plugins.rename('styles.min.css'))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(plugins.livereload());

});


// Concat and Output Scripts
gulp.task('scripts', function() {

	return gulp.src(paths.scripts.src)
		.pipe(plugins.concat('scripts.js'))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(plugins.uglify())
		.pipe(plugins.rename('scripts.min.js'))
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(plugins.livereload());

});


/*
// Copy (if changed) all of our vendor scripts to the build js folder
gulp.task('vendor', function() {

	return gulp.src(paths.scripts.vndr)
		.pipe(plugins.changed(paths.scripts.dest))
		.pipe(gulp.dest(paths.scripts.dest));

});
*/


// Check for changed image files and compress them
gulp.task('images', function() {

	return gulp.src(paths.images.src)
		.pipe(plugins.changed(paths.images.dest))
		.pipe(plugins.imagemin({
			optimizationLevel: 7,
			progressive: true,
			use: [pngcrush()]
		}))
		.pipe(gulp.dest(paths.images.dest));

});


// Compress all svg files and combine into a single file
gulp.task('svg', function() {

	return gulp.src(paths.svg.src)
		.pipe(plugins.imagemin({
			svgoPlugins: [{
				removeViewBox: false,
				removeUselessStrokeAndFill: false
			}]
		}))
		.pipe(plugins.svgstore())
		.pipe(gulp.dest(paths.images.dest));

});


// Copy (if changed) all of our miscellaneous files to the build folder
gulp.task('extras', function() {

	// currently manually copying fonts folder into assets

	return gulp.src([paths.extra.root + '*.*', paths.extra.root + '.htaccess'])
		.pipe(plugins.changed(paths.extra.dest)) // not sure how to check if this is working or not
		.pipe(gulp.dest(paths.extra.dest));

});


// Use rsync to deploy to server (no need to exclude files since everything comes from 'build' folder)
gulp.task('deploy', function() {

	gulp.src('build/') // ['build/.htaccess', 'build/index.html', 'build/assets/**']
		.pipe(plugins.rsync({
			root: 'build',
			hostname: secrets.server.host,
			destination: secrets.server.dest,
			incremental: true,
			progress: true,
			recursive: true,
			clean: true,
			exclude: ['.DS_Store']
		}));

});


// Watch over specified files and run corresponding tasks...
// does not inject SVG... need better process for this
gulp.task('watch', ['haml', 'styles', 'scripts'], function() {

	plugins.livereload.listen(); // start livereload server

	// watch dev files, rebuild when changed
	gulp.watch(paths.haml.src + '**/*.haml', ['haml']);  // watch all HAML files, including partials (recursively)
	gulp.watch(paths.styles.src + '*.scss', ['styles']); // watch all SCSS files, including partials
	gulp.watch(paths.scripts.src, ['scripts']); // watch all JS files

});


// Default gulp task, should run gulp clean prior to running the default task...
gulp.task('default', ['haml', 'styles', 'scripts', 'images', 'extras', 'svg']); // remove 'vendor' task