// Initialize modules
 const { src, dest, watch, series, parallel } = require('gulp');

// Importing the Gulp packages 
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const panini = require('panini');  
const browsersync = require('browser-sync').create();


// define file paths
const files = {
	scssPath: 'src/scss/**/*.scss',
	jsPath: 'src/scripts/*.js',
	jsVendorPath: 'src/scripts/vendor/**/*.js',
	jsBootstrapPath: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 	
	htmlPath: 'src/**/*.html',	 
};

 
// Sass task 
function scssTask() {
	return src(
		[files.scssPath]
		, { sourcemaps: true }) 
		.pipe(sass()) 
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('dist', { sourcemaps: '.' })); 
}
 

// JS task (1 of 3) - Concat and minify main JS
function jsTask() {
	return src(
		[
			files.jsPath
		],
		{ sourcemaps: true }
	)
	.pipe(concat('all.js'))
	.pipe(terser())
	.pipe(dest('dist', { sourcemaps: '.' }));
}

// JS task (2 of 3) - Concat Bootstrap full bundle from node_modules/
function jsBootstrapTask() {
	return src(
		[
			"dist/all.js", //combine with dist/all.js
			files.jsBootstrapPath 
		],
		{ sourcemaps: true }
	)
	.pipe(concat('all.js'))
	.pipe(dest('dist', { sourcemaps: '.' }));
}

// JS task (3 of 3) - Concat JS from src/scripts/vendor/
function jsVendorTask() {
	return src(
		[
			"dist/all.js", //combine with dist/all.js
			files.jsVendorPath 
		],
		{ sourcemaps: true }
	)
	.pipe(concat('all.js'))
	.pipe(dest('dist', { sourcemaps: '.' }));
}
 

// HTML Task (Panini)
function htmlTask() {
	return  src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      helpers: 'src/helpers/',
      data: 'src/data/'
    }))
	.pipe(dest('dist', { sourcemaps: '.' }));
	
}
function resetPages(cb) {
	panini.refresh();
	cb();
}
 

// Cachebust
function cacheBustTask() {
	var cbString = new Date().getTime();
	return src(['dist/index.html'])
		.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
		.pipe(dest('.'));
}

// Browsersync 
function browserSyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: 'dist',
		},
		port: 3000 
	});
	cb(); 
}
function browserSyncReload(cb) {  
	browsersync.reload();
	cb();  
}

// Watch task 
function watchTask() {  
	watch(
		[ files.scssPath, files.jsPath ],
		{ interval: 1000, usePolling: true }, //Makes docker work
		series( parallel(scssTask, jsTask), jsBootstrapTask, jsVendorTask, browserSyncReload)
	);
	watch(
		[ files.htmlPath],
		{ interval: 1000, usePolling: true }, //Makes docker work
		series(  resetPages, htmlTask, browserSyncReload)
	);
  
}

// Export the Gulp tasks (command >> gulp bs)
exports.bs = series(
	parallel(scssTask, jsTask),
	jsBootstrapTask,
	jsVendorTask,
	resetPages,	
	htmlTask,		
	cacheBustTask,
	browserSyncServe,
	watchTask
);
//for production build (command >> gulp production)
exports.production = series(
	parallel(scssTask, jsTask),
	jsBootstrapTask,
	jsVendorTask,
	htmlTask		
 
);