"use strict";

var bower   = require("bower");
var gulp    = require("gulp");
var concat  = require("gulp-concat");
var file    = require("gulp-file");
var include = require("gulp-include");
var shell   = require("gulp-shell");
var uglify  = require("gulp-uglify");
var argv    = require("yargs").argv;
var del     = require('del');
var fs      = require('fs');

var manifest = require('./src/manifest.json');

var config = {
	bowerDir: 'bower_components/'
};

gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dist/**/*'], cb);
});

gulp.task("js", ['clean'], function() {
  return gulp
	.src([
		"src/scripts/*.js"
	])
	.pipe(include())
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest("dist/scripts/"));
});

gulp.task("bower", function(cb) {
  bower.commands
	.install()
	.on("end", function() { cb(); });
});

gulp.task("libs", ["clean", "bower"], function() {
  return gulp
	.src([
		  config.bowerDir + 'jquery/dist/jquery.min.js'
	])
	.pipe(concat("libraries.js"))
	.pipe(uglify({mangle: false}))
	.pipe(gulp.dest("dist/scripts/"));
});

gulp.task('css', ['clean'], function() {
  return gulp
	.src([
		'src/css/*.css'
	])
	.pipe(gulp.dest("dist/css/"));
});

gulp.task("img", ['clean'], function() {
  return gulp
	.src([
		  'src/img/**/*.png',
		  'src/img/**/*.jpg'
	])
	.pipe(gulp.dest("dist/img"));
});

gulp.task("svg", ['clean', 'version', 'img'], function() {
  fs.mkdir('dist/img');

  var icons_sizes = ["16", "48", "128"];
  var browser_icons_sizes = ["19", "38"];
  var commands = [];
  
  icons_sizes.forEach(function(size) {
	var filename = "img/icon"+size+".png";
	commands.push("convert -resize "+size+"x"+size+" -background none <%= file.path %> dist/"+filename);
	manifest.icons[size] = filename;
  })
  
  browser_icons_sizes.forEach(function(size) {
	var filename = "img/icon"+size+".png";
	commands.push("convert -resize "+size+"x"+size+" -background none <%= file.path %> dist/"+filename);
	manifest.browser_action.default_icon[size] = filename;
  })
  
  return gulp.src('src/img/beshamel.logo.desktop-icon.static.svg', {read: false})
    .pipe(shell(commands));
});

gulp.task("html", ['clean'], function() {
  return gulp
	.src([
		  'src/*.html'
	])
	.pipe(gulp.dest("dist/"));
});

gulp.task("manifest", ['clean', 'version', 'svg'], function() {
  return file('manifest.json', JSON.stringify(manifest, null, 2), { src: true })
	.pipe(gulp.dest("dist/"));
});

gulp.task("version", function() {
    var version = manifest.version.split('.');
	// increment minor version if --increment-version
	if (argv.incrementVersion) {
		version[1] = Number(version[1]) + 1;
		version[2] = 0;
	}
	
	//increment build number
	version[2] = Number(version[2]) + 1;
    manifest.version=version.join('.');

  return file('manifest.json', JSON.stringify(manifest, null, 2), { src: true })
	.pipe(gulp.dest("src/"));
});

gulp.task("assets", [
	'js',
	'libs',
	'css',
	'img',
	'svg',
	'html',
	'manifest'
]);

gulp.task("build", [
	'assets'
]);

gulp.task("pack", function() {
	return gulp
	  .src(['dist'])
	  .pipe(shell([
	  	'chrome.exe --pack-extension=<%= file.path %> --pack-extension-key=<%= file.base + "beshamel.crx.pem" %>',
		'mv ./dist.crx ./beshamel.crx'
	  ]));
});