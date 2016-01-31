//
// Gulp Config
//

/*
 *  Environment Variables
 *  --------------------------------------------------
 */
var env = {
    isProduction: false,
};



 /*
 *  Load Plugins
 *  --------------------------------------------------
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({ // Load all dev dependencies in package.json except 'grunt related'.
    pattern: ['*', '!{grunt,gulp-grunt}'],
    scope: ['devDependencies']
});



/*
 *  Task: Truncate and delete the entire destination folder
 *  --------------------------------------------------
 */
gulp.task('clean', function() {
    return plugins.del([
        './dist/'
    ]);
});



/*
 *  Task: Copy non-compiling files to build folder
 *  --------------------------------------------------
 */
gulp.task('copy', function(next) {
    gulp.src(['./src/manifest.json']).pipe(gulp.dest('./dist/'));
    gulp.src(['./src/assets/images/**/*']).pipe(gulp.dest('./dist/images/'));
    gulp.src(['./src/assets/fonts/**/*']).pipe(gulp.dest('./dist/fonts/'));
    gulp.src(['./src/**/*.html']).pipe(gulp.dest('./dist/'));
    next();
});



/*
 *  Task: Sass Compilation
 *  --------------------------------------------------
 */
gulp.task('styles', function() {
    return gulp.src('./src/stylesheets/*.scss')
        .pipe(plugins.if(!env.isProduction, plugins.sourcemaps.init()))
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.autoprefixer({
            browser: ['Firefox >= 32', 'Chrome >= 38', 'Explorer >= 10', 'iOS >= 7'],
            cascade: false
        }))
        .pipe(plugins.if(env.isProduction, plugins.cssnano()))
        .pipe(plugins.if(!env.isProduction, plugins.sourcemaps.write()))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(plugins.browserSync.reload({
            stream: true
        }));
});



/*
 *  Task: Combine and compile server-side scripting for client-side purpose using Browserify
 *  --------------------------------------------------
 */
gulp.task('scripts', function() {
    gulp.src(['./src/scripts/**/*.js'])
        .pipe(plugins.jshint({
            node: true, // Inform JSHint that this is a Node project to better fine tune error report
            browser: true,
        }))
        .pipe(plugins.jshint.reporter('default')); // May opt to use 'jshint-stylish' reporter.

    return gulp.src('./src/scripts/app.js')
        .pipe(plugins.if(!env.isProduction, plugins.sourcemaps.init()))
        .pipe(plugins.browserify({
            debug: !env.isProduction,
        }))
        .pipe(plugins.if(env.isProduction, plugins.uglify()))
        .pipe(plugins.if(!env.isProduction, plugins.sourcemaps.write()))
        .pipe(gulp.dest('./dist/js/'));
});



/*
 *  Task: Connect Server
 *  --------------------------------------------------
 */
gulp.task('server', function() {
    return plugins.browserSync({
        server: {
            baseDir: './dist/',
            //middleware: [
            //    plugins.connectHistoryApiFallback
            //]
        },
        files: [
            './dist/**/*.html',
            //'./dist/css/*.css', // Listen to CSS changes on 'styles' task oppose to here.
            './dist/**/*.js',
        ],
        notify: false,
    });
});



/*
 *  Task: Build project to destination folder. This is broken up into 2 'gulp.task()' in order to execute the tasks in
 *        this order: 'clean' -> 'copy'|'styles'
 *        Watch out for gulp 4.0 as the dependency system will become easier to manage.
 *  --------------------------------------------------
 */
gulp.task('build-tasks', ['copy', 'scripts', 'styles'], function(next) {
    this.emit('build-tasks:done');
    next();
});
gulp.task('build', ['clean'], function(next) {
    gulp.start('build-tasks');
    this.on('build-tasks:done', next);
});



/*
 *  Task: Watch file changes on source folder and execute associated task(s).
 *  --------------------------------------------------
 */
gulp.task('watch', function() {
    gulp.watch(['./src/**/*.html'], ['copy']);
    gulp.watch(['./src/stylesheets/**/*.scss'], ['styles']);
    gulp.watch(['./src/scripts/**/*.js'], ['scripts']);
    //gulp.watch('app/images/**/*', ['images']);
});



/*
 *  Task: Preparation for Production environment output
 *  --------------------------------------------------
 */
gulp.task('build-production', function() {
    env.isProduction = true;
    return gulp.start('build');
});
gulp.task('bp', function() { // Shortcut
    return gulp.start('build-production');
});



/*
 *  Default: By execute 'gulp', it will first 'build', then active 'server' and 'watch' in that sequence.
 *  --------------------------------------------------
 */
gulp.task('default', ['build'], function() {
    gulp.start('watch', ['server']);
});
