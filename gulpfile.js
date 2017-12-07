var gulp = require('gulp');
var plumber = require('gulp-plumber');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var rev = require('gulp-rev');
var tinypng = require('gulp-tinypng');
var env = process.env.NODE_ENV || "development";
var agent = process.env.agent || 'yg';
var config = {
    app: "gulp-demo",
    src: "app",
    dist: "dist",
    env: env,
    tmp: ".tmp",
    entries: "app/scripts/main.js",
    agent: agent
};
gulp.task('clean:dist',function(){
    var dir = [config.tmp,config.dist];
    var option = {dot:true};
    return del(dir,option);
});
gulp.task('imagemin', function() {
    return gulp.src(config.src + "/images/**/*.{png,jpg,jpeg,gif}")
    .pipe(tinypng('BZ9n7RMXnXLTZfgTLAZzQ7--KDHkX4Ov'))
        .pipe(gulp.dest(config.dist + "/images"));
});
gulp.task('imagemin:mobile', function() {
    return gulp.src(config.src + "/mobile/images/**/*.{png,jpg,jpeg,gif}")
        .pipe(tinypng('BZ9n7RMXnXLTZfgTLAZzQ7--KDHkX4Ov'))
        .pipe(gulp.dest(config.dist + "/mobile/images"));
});
gulp.task('copycss', function() {
    return gulp.src(["styles/*.css","mobile/styles/*.css"], {
        cwd: config.src,
        dot: true,
        base: config.src
    })
        .pipe(gulp.dest(config.tmp));
});
gulp.task('copyjs', function() {
    return gulp.src(["scripts/*.js","mobile/scripts/*.js"], {
        cwd: config.src,
        dot: true,
        base: config.src
    })
        .pipe(gulp.dest(config.tmp));
});
gulp.task('copyimages', function() {
    return gulp.src(["images/**/*.{png,jpg,jpeg,gif,webp}","mobile/images/**/*.{png,jpg,jpeg,gif,webp}"], {
        cwd: config.src,
        dot: true,
        base: config.src
    })
        .pipe(gulp.dest(config.dist));
});
gulp.task('copywebp', function() {
    return gulp.src(["images/**/*.webp","mobile/images/**/*.webp"], {
        cwd: config.src,
        dot: true,
        base: config.src
    })
        .pipe(gulp.dest(config.dist));
});
gulp.task('copydist', function() {
    return gulp.src([
        "*.{ico,txt}",
        "mobile/*.{ico,txt}",
        "*.html",
        "mobile/*.html",
        "fonts/*",
        "mobile/fonts/*",
        "music/*",
        "mobile/music/*"
    ], {
        cwd: config.src,
        dot: true,
        base: config.src
    })
        .pipe(gulp.dest(config.dist));
});
gulp.task('replace', function() {
    var reg = /\{\n*(\s)*env:.*,\n*\s*agent:.*\s*\n*\}/;
    var replacement = "{env:'" + config.env + "',agent:'" + config.agent +"'}";
    return gulp.src(config.tmp + "/scripts/server.config.js")
        .pipe(replace(reg, replacement))
        .pipe(gulp.dest(config.tmp + "/scripts"));
});
gulp.task('replace:mobile', function() {
    var reg = /\{\n*(\s)*env:.*,\n*\s*agent:.*\s*\n*\}/;
    var replacement = "{env:'" + config.env + "',agent:'" + config.agent +"'}";
    return gulp.src(config.tmp + "/mobile/scripts/server.config.js")
        .pipe(replace(reg, replacement))
        .pipe(gulp.dest(config.tmp + "/mobile/scripts"));
});
gulp.task('usemin', function() {
    return gulp.src(config.src + "/**/*.html")
        .pipe(usemin({
            js: [uglify,rev],
            css: [cssmin, rev]
        }))
        .pipe(gulp.dest(config.dist))
});
gulp.task('htmlmin', function() {
    var htmlSrc = config.dist + "/**/*.html";
    return gulp.src(htmlSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.dist));
});
/**
 * 发布到测试环境
 */
gulp.task('build', gulpSequence(
    "clean:dist",
    "copyimages",
    "copycss",
    "copyjs",
    "replace",
    "replace:mobile",
    "copydist",
    "usemin",
    "htmlmin"
));
/**
 * 发布到现网环境-图片未压缩
 */
gulp.task('deploy', gulpSequence(
    "clean:dist",
    "copywebp",
    "imagemin",
    "imagemin:mobile",
    "copycss",
    "copyjs",
    "replace",
    "replace:mobile",
    "copydist",
    "usemin",
    "htmlmin"
));


