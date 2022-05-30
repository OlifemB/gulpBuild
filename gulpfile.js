const gulp = require("gulp");
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const sourcemaps  = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");

const paths = {
  styles: {
    src: "./src/styles/**/*.scss",
    dest: "./dist/css/",
  },
  scripts: {
    src: "./src/script/**/*.js",
    dest: "./dist/js/",
  },
};

const clean = () => {
  return del(["dist"]);
};

const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(concat("main.min.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest));
};

const scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
};

const watch = () => {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
};

const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;
