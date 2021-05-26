import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import postCSS from "gulp-postcss";
import autoprefixer from "gulp-autoprefixer";
import minifyCSS from "gulp-csso";
import tailwindcss from "tailwindcss";
import uglify from "gulp-uglify";
import babel from "gulp-babel";
import typescript from "gulp-typescript";

sass.compoiler = require("node-sass");


const gulpdir = {
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/styles.scss",
        dest: "statics/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "statics/js"
    },
    ts: {
        watch: "src/ts/**/*.ts",
        src: "src/ts/*.ts",
        dest: "statics/ts" 
    }
}

const clean = () => del(["static/"])

const styles = () => gulp
    .src(gulpdir.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(postCSS([
        tailwindcss,
        autoprefixer
    ]))
    //autoprefixer browsers -> browserslist in package.json
    .pipe(minifyCSS())
    .pipe(gulp.dest(gulpdir.scss.dest));

const js = () => gulp
    .src(gulpdir.js.src)
    .pipe(babel({
        presets: [["@babel/preset-env", { modules: false }]]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(gulpdir.js.dest));

const ts = () => gulp
    .src(gulpdir.ts.src)
    .pipe(typescript({
        target: 'ES5',
        removeComments: true,
    }))
    .pipe(gulp.dest(gulpdir.ts.dest))

const ready = gulp.series([clean]);
const assets = gulp.series([js, ts, styles]);

export const build = gulp.series([ready, assets,]);