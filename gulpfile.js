// Gulp and plugins
var gulp = require('gulp');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var slim = require('gulp-slim');
var sourcemaps = require('gulp-sourcemaps');
var gulpcopy = require('gulp-copy');

var argv = require('yargs').argv;

var del = require('del');
var path = require('path');
var changeCase = require('change-case');

var localRailsEngineAssetsPath = "../sapphire_cms_rails_spree/app/assets"

var files = {  
  css: ['src/styles/**/*.scss', 'src/styles/**/*.css'],
  js: ['src/app/**/*.coffee', 'src/app/**/*.js'],
  templates: ['src/templates/**/*.html', 'src/templates/**/*.slim'],
  dist: { 
    css: ['dist/sapphire-cms.spree.css'],
    js: ['dist/sapphire-cms.spree.js'],
    templates: ['dist/templates/**/*']
  }
};

var compileModuleCss = function(src, dest){
  return gulp.src(src)
    .pipe(gulpif(/[.]scss$/, sass()))
    .pipe(concat(dest))
    .pipe(gulp.dest(path.join('dist')));
};

var compileModuleJs = function(src, dest){
  return gulp.src(src)
    .pipe(gulpif(/[.]coffee$/, coffee()))
    .pipe(concat(dest))
    .pipe(gulp.dest(path.join('dist')));
};

var compileModuleTemplates = function(src, dest){
  return gulp.src(src)
    .pipe(gulpif(/[.]slim$/, slim({
      pretty: true,
      options: "attr_list_delims={'(' => ')', '[' => ']'}"
    })))
    .pipe(gulp.dest(path.join('dist', dest)))
}

gulp.task('clean', function(cb) {
  del(['dist/**'], cb);
});

gulp.task('compile:js', function() {
  var stream = compileModuleJs(files.js, 'sapphire-cms.spree.js');
  stream.on('end', function(){
    if(argv.syncToRails){
      gulp.start('copy:js:rails');
    }
  });
});

// Tasks to sync files to neighboring sapphire_cms_rails Rails engine for development
var copyFilesToLocalRailsEngine = function(src, destDir){
  var prefix = 0;
  var wildCardIndex = src[0].indexOf('*');
  if(wildCardIndex >= 0){
    pathBeforeWildcard = src[0].slice(0,wildCardIndex);
    prefix = pathBeforeWildcard.split('/').length - 1;
  }else{
    prefix = src[0].split('/').length
  }
  return gulp.src(src)
    .pipe(gulpcopy(destDir, {
      prefix: prefix,

      // Change file leading directories to snake case for Rails
      destPath: function(path){
        var parts = path.split('/');
        var name = parts.pop();
        modifiedParts = [];
        parts.forEach(function(part){
          modifiedParts.push(changeCase.snakeCase(part));
        });
        modifiedParts.push(name);
        return modifiedParts.join('/');
      }
    }));
}

gulp.task('install:templates:rails', function(){

});

gulp.task('copy:js:rails', function(){
  return copyFilesToLocalRailsEngine(files.dist.js, path.join(localRailsEngineAssetsPath, 'javascripts', 'spree', 'frontend'));
});

gulp.task('copy:rails', function(){
  gulp.start('copy:js:rails');
});


gulp.task('compile:all', [
  'compile:js'
]);

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(files.js, ['compile:js']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'compile:all']);