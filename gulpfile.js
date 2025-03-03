const gulp = require("gulp");
const ejs = require("gulp-ejs");
const sass = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
const rename = require("gulp-rename");
// Lintとコード整形用のプラグイン
const htmlhint = require("gulp-htmlhint");
const sassLint = require("gulp-sass-lint");
const eslint = require("gulp-eslint");
const prettier = require("gulp-prettier");
const browserSync = require("browser-sync").create();
const fs = require("fs");

// const path = 'jp-ja/special/gscollection202411-en;
// const path = 'jp-ja/special/gscollection202411';
const path = "jp-ja/special/gscollection202502";
// const path = "jp-ja/special/gscollection202502-en";

const asset = "asset";
// const asset = 'shared';

gulp.task("format", () => {
  return gulp
    .src([`src/${path}/${asset}/index.ejs`, `src/${path}/${asset}/scss/**/*.scss`, `src/${path}/${asset}/js/**/*.js`])
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest((file) => file.base));
});

gulp.task("ejs", () => {
  const commonData = JSON.parse(fs.readFileSync(`./src/${path}/${asset}/data/common.json`));

  return gulp
    .src([`src/${path}/**/index.ejs`])
    .pipe(
      ejs(
        {
          root: `src/${path}`,
          common: commonData,
        },
        {},
        { ext: ".html" }
      )
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(`htdocs/${path}`))
    .pipe(browserSync.stream());
});

gulp.task("css", () => {
  return gulp
    .src(`src/${path}/${asset}/css/**/*.css`)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(`htdocs/${path}/${asset}/css`))
    .pipe(browserSync.stream());
});

gulp.task("sass", () => {
  return gulp
    .src(`src/${path}/${asset}/scss/**/*.scss`)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(`htdocs/${path}/${asset}/css`))
    .pipe(browserSync.stream());
});

gulp.task("js", () => {
  return (
    gulp
      .src(`src/${path}/${asset}/js/**/*.js`)
      // .pipe(babel({
      //   presets: ['@babel/env']
      // }))
      .pipe(gulp.dest(`htdocs/${path}/${asset}/js`))
      .pipe(browserSync.stream())
  );
});

gulp.task("images", () => {
  const sourcePaths = [`src/${path}/${asset}/img/**/*`];

  const destinationMap = {
    [`src/${path}/${asset}/img`]: `htdocs/${path}/${asset}/img`,
  };

  return gulp
    .src(sourcePaths)
    .pipe(
      gulp.dest((file) => {
        return destinationMap[Object.keys(destinationMap).find((key) => file.base.includes(key))];
      })
    )
    .pipe(browserSync.stream());
});

// ブラウザの自動リロード
gulp.task("serve", () => {
  browserSync.init({
    server: `./htdocs/${path}`,
  });

  gulp.watch(`src/${path}/**/*.ejs`, gulp.series("ejs"));
  gulp.watch(`src/${path}/${asset}/data/**/*.json`, gulp.series("ejs"));
  gulp.watch(`src/${path}/${asset}/scss/**/*.scss`, gulp.series("sass"));
  gulp.watch(`src/${path}/${asset}/js/**/*.js`, gulp.series("js"));
  gulp.watch(`src/${path}/${asset}/img/**/*`, gulp.series("images"));
});

// デフォルトタスク
gulp.task("default", gulp.series("ejs", "css", "sass", "js", "images", "serve"));
