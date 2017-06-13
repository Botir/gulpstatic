'use strict';
 
var gulp          = require('gulp'),
	autoprefixer  = require('gulp-autoprefixer'),
	imagemin      = require('gulp-imagemin'),
	uglify        = require('gulp-uglify'),
	clean         = require('gulp-clean'),
	browserSync   = require('browser-sync'),
	concat 		  = require('gulp-concat'),
    csso = require('gulp-csso'), // Минификация CSS
	reload        = browserSync.reload;

var p = require('gulp-load-plugins')({ // This loads all the other plugins.
  DEBUG: false,
  pattern: ['gulp-*', 'gulp.*', 'del', 'run-*', 'browser*', 'vinyl-*'],
  rename: {
    'vinyl-source-stream': 'source',
    'vinyl-buffer': 'buffer',
    'gulp-util': 'gutil'
  },
}),


autoprefixerOpts = {
    browsers: ['last 3 versions', '> 5%']
  },

src  = 'source/', // The Middleman source folder
dest = 'assets/';   // The "hot" build folder used by Middleman's external pipeline;

// Пути
var path = {
	app : {          // Исходники	
			css    : src + 'css/**/*.{css,scss,sass}',	
		},
	dist : {         // Релиз		
		css    : src+dest + 'css/'		
	},
	watch : {        // Наблюдение
		css    : src + 'css/**/*.{css,scss,sass}',
	},
	clean      : src+dest // Чистка
};

// Настройка сервера
var config = {
	server : {
		'baseDir' : dest
	},
	host : 'localhost',
	port : 9000,
	tunel : true
};

// CSS Preprocessing
gulp.task('css', function() {
  return gulp.src(path.app.css)   
    .pipe(p.autoprefixer(autoprefixerOpts)).on('error', handleError)    
    .pipe(csso()) // минимизируем css 
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest(path.dist.css));
    
});


// Запуск вебсервера
gulp.task('webserver', function(){
	browserSync(config);
});

// Чистка
gulp.task('clean', function(cb){
	clean(path.clean, cb);
});

// Задачи по-умолчанию
gulp.task('default', ['css']);

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}