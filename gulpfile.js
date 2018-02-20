"use strict";


"use strict";
var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task('default', ['css'], function () {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/js/*.js", ['javascript']).on('change', browserSync.reload);
    gulp.watch("scss/**/**/**/*.scss", ['css']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("./*.html", ['html']);
});

gulp.task('html', function () {
    return gulp.src('./*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('app'));
});


//Tarea para comprimir imágenes
gulp.task('images', function() {
    gulp.src('img/**/*.{png,jpg,jpeg,gif,svg}')//Ruta a la carpeta images a puntando a las imágenes
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('app/img')) //Carpeta donde se guardaran las imágenes comprimidas

});
//Vuelve a ejecutar la tarea cuando se modifica algún archivo
gulp.task('watch', function(){
    gulp.watch('img/**/*', ['images']);
});

// Javascript Tarea

gulp.task('javascript', function (cb) {
    pump([
            gulp.src('js/*.js'), //Ruta de la carpeta apuntando a los archivos `.js`
            uglify(), //Comprime los archivos `.js`
            gulp.dest('app/js')//Carpeta donde se guardara el archivo `.js` comprimido
        ],
        cb
    );
});

//Vuelve a ejecutar la tarea cuando se modifica algún archivo
gulp.task('watch', function(){
    gulp.watch("app/js/*", ['javascript']);
});

//Renombrar CSS

gulp.task('rename-css', function() {
    gulp.src('app/css/**/*.css')
        .pipe(rename('*.min.css'))
        .pipe(gulp.dest('app/css/dist'));
});

//Vuelve a ejecutar la tarea cuando se modifica algún archivo
gulp.task('watch', function(){
    gulp.watch('app/css/**/*.css', ['rename-css']);
});

gulp.task('css', function () {
    return gulp.src('scss/**/**/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(autoprefixer({
            browsers: ["last 7 versions"],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

