var gulp = require('gulp'),
    watch = require('gulp-watch'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    scsslint = require('gulp-scss-lint'),
    jslint = require('gulp-jslint'),
    spritesmith = require('gulp.spritesmith'),
    reload = browserSync.reload;

    var path = {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/img/',
            fonts: 'build/fonts/'
        },
        src: { //Пути откуда брать исходники
            html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
            js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
            styles: 'src/styles/main.scss',
            img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
            sprite: 'src/img/icons/**/*.png',
            fonts: 'src/fonts/**/*.*'
        },
        watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
            html: 'src/**/*.html',
            js: 'src/js/**/*.js',
            styles: 'src/styles/**/*.scss',
            img: 'src/img/**/*.*',
            sprite: 'src/img/**/*.png',
            fonts: 'src/fonts/**/*.*'
        },
        clean: './build'
    };


    var config = {
        server: {
            baseDir: "./build"
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "xoxo"
    };

    gulp.task('sprite', function () {
      var spriteData = gulp.src('src/img/icons/**/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        padding: 40
      }))
        return spriteData.pipe(gulp.dest('src/img/sprites/'));
    });

    gulp.task('html:build', function () {
        gulp.src(path.src.html) //Выберем файлы по нужному пути
            .pipe(rigger()) //Прогоним через rigger
            .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
            .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
    });

    gulp.task('js:build', function () {
        gulp.src(path.src.js) //Найдем наш main файл
            .pipe(rigger()) //Прогоним через rigger
            .pipe(sourcemaps.init()) //Инициализируем sourcemap
            .pipe(uglify()) //Сожмем наш js
            .pipe(sourcemaps.write()) //Пропишем карты
            .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
            .pipe(reload({stream: true})); //И перезагрузим сервер
    });

    gulp.task('lint', function () {
        return gulp.src(path.src.js)
            .pipe(jslint())
            .pipe(jslint.reporter('default'))
    });

    gulp.task('styles:build', function () {
        gulp.src(path.src.styles) //Выберем наш main.scss
        var processors = [autoprefixer({browsers: ['last 2 version']})];
            return gulp.src(path.src.styles)
            .pipe(postcss(processors))
            .pipe(sourcemaps.init()) //То же самое что и с js
            .pipe(sass()) //Скомпилируем
            .pipe(cssmin()) //Сожмем
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.build.css)) //И в build
            .pipe(reload({stream: true}));
    });

    gulp.task('scss-lint', function() {
      return gulp.src(path.src.styles)
        .pipe(scsslint());
    });

    gulp.task('image:build', function () {
        gulp.src(path.src.img) //Выберем наши картинки
            .pipe(imagemin({ //Сожмем их
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img)) //И бросим в build
            .pipe(reload({stream: true}));
    });

    gulp.task('fonts:build', function() {
        gulp.src(path.src.fonts)
            .pipe(gulp.dest(path.build.fonts))
    });

    gulp.task('build', [
        'html:build',
        'js:build',
        'styles:build',
        'fonts:build',
        'image:build'
    ]);

    gulp.task('watch', function(){
        watch([path.watch.html], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.styles], function(event, cb) {
            gulp.start('styles:build');
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
        watch([path.watch.img], function(event, cb) {
            gulp.start('image:build');
        });
        watch([path.watch.fonts], function(event, cb) {
            gulp.start('fonts:build');
        });
    });


    gulp.task('webserver', function () {
        browserSync(config);
    });

    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });


    gulp.task('default', ['lint', 'build', 'scss-lint', 'webserver', 'watch']);
