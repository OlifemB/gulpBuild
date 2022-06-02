const gulp = require("gulp");
const del = require("del");
const size = require("gulp-size");
const rename = require("gulp-rename");
const newer = require("gulp-newer");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const ejs = require("gulp-ejs");
const browsersync = require("browser-sync").create();

const paths = {
  html: {
    src: ["src/*.html", "src/*.ejs"],
    dest: "dist/",
  },
  styles: {
    src: "src/styles/**/*.scss",
    dest: "dist/styles/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/scripts/",
  },
  images: {
    src: "src/images/**/*.{jpg,jpeg,png,gif}",
    dest: "dist/images/",
  },
  fonts: {
    src: "src/fonts/*",
    dest: "dist/fonts/",
  },
};

function clean() {
  return del(["dist/*", "!dist/img"]);
}

function html() {
  return (
    gulp
      .src(paths.html.src)
      .pipe(plumber())
      .pipe(ejs())
      .pipe(rename({ extname: ".html" }))
      // .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(
        size({
          showFiles: true,
        })
      )
      .pipe(gulp.dest(paths.html.dest))
      .pipe(browsersync.stream())
  );
}

// function styles() {
//   return (
//     gulp
//       .src(paths.styles.src)
//       .pipe(sourcemaps.init())
//       .pipe(sass())
//       .pipe(postcss([
//         tailwindcss,
//         autoprefixer
//       ]))
//       .pipe(concat("main.min.css"))
//       //.pipe(sourcemaps.write("."))
//       .pipe(gulp.dest(paths.styles.dest))
//       .pipe(browsersync.stream())
//   );
// }

function styles() {
  return (
    gulp
      .src(paths.styles.src)
      .pipe(sass())
      .pipe(postcss([
        tailwindcss,
        autoprefixer
      ]))
      .pipe(concat("main.min.css"))
      .pipe(gulp.dest(paths.styles.dest))
      .pipe(browsersync.stream())
  );
}

function scripts() {
  return (
    gulp
      .src(paths.scripts.src)
      .pipe(sourcemaps.init())
      .pipe(
        babel({
          presets: ["@babel/env"],
        })
      )
      .pipe(uglify())
      .pipe(concat("main.min.js"))
      //.pipe(sourcemaps.write("."))
      .pipe(gulp.dest(paths.scripts.dest))
      .pipe(browsersync.stream())
  );
}

function img() {
  return gulp
    .src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(
      imagemin({
        progressive: true,
      })
    )
    .pipe(
      size({
        showFiles: true,
      })
    )
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browsersync.stream());
}

function fonts() {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browsersync.stream());
}

function watch() {
  browsersync.init({
    notify: false,
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch(paths.html.dest).on("change", browsersync.reload);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.images.src, img);
}

const build = gulp.series(
  clean,
  html,
  gulp.parallel(fonts, styles, scripts, img),
  watch
);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.watch = watch;
exports.build = build;
exports.default = build;
