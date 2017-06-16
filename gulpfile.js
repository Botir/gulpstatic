'use strict';
 
var gulp          	= require('gulp'),
	rename  	  	= require('gulp-rename'),
	header        	= require('gulp-header'),
	postcss       	= require('gulp-postcss'),
	postcssImport 	= require('postcss-import'),
	postcssCssnext 	= require('postcss-cssnext'),
	cssnano 		= require('cssnano'),
	concat 		  	= require('gulp-concat'),
	uglify        	= require('gulp-uglify'),
	size        	= require('gulp-size'),

src  = 'source/', // The Middleman source folder
dest = 'assets/';   // The "hot" build folder used by Middleman's external pipeline;

// Пути
var path = {	
	scripts: {
		src: src + 'js/**/*.js',
		dest: dest + 'js/'
	},
	styles: {
		src: src + 'css/theme-style.css',	
		dest: dest + 'css/'
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
// JS Preprocessing
//gulp.src(['app/js/app.js', 'app/js/**/*.js']),
gulp.task('scripts', function(){
	gulp.src(path.scripts.src)		
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(size())
		.pipe(gulp.dest(path.scripts.dest));
		
});


// CSS Preprocessing
gulp.task('css', function() {
  return gulp.src(path.styles.src)   
    .pipe(postcss([
      postcssImport(),
      postcssCssnext(),
    ]))   
    .pipe(gulp.dest(path.styles.dest))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(postcss([
      cssnano({
        autoprefixer: false,
      })
    ]))
   .pipe(gulp.dest(path.styles.dest))
    
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
gulp.task('default', ['scripts','css']);

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}