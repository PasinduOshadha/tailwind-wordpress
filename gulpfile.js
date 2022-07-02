const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass')); // This is different from the video since gulp-sass no longer includes a default compiler. Install sass as a dev dependency `npm i -D sass` and change this line from the video.
const autoprefixer = require('autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const tailwindcss = require('tailwindcss')
const imagewebp = require('gulp-webp');

// file paths
const files = {
    scssPath: 'assets/src/sass/**/*.scss',
    jsPath: 'assets/src/js/**/*.js',
    dist: 'assets/dist/'
}


//compile, prefix, and min scss
function compilescss() {
  return src(files.scssPath) // change to your source directory
    .pipe(sass())
    .pipe(postcss([
      require('tailwindcss'),
      autoprefixer({})
    ]))
    .pipe(minify())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(files.dist + 'css')) // change to your final/public directory
};

// minify js
function jsmin(){
  return src(files.jsPath) // change to your source directory
    .pipe(concat('iris-garden-bundle.js'))
    .pipe(terser())
    .pipe(dest(files.dist + 'js')); // change to your final/public directory
}


//optimize and move images
function webpImage() {
  return src(files.dist + 'images/*.{jpg,png}') // change to your source directory
    .pipe(imagewebp())
    .pipe(dest(files.dist + 'images')) // change to your final/public directory
};

//watchtask
function watchTask(){
  watch(files.scssPath, compilescss); // change to your source directory
  watch(files.jsPath, jsmin); // change to your source directory
  watch(files.dist + 'images/*.{jpg,png}', webpImage); // change to your source directory
}

// Default Gulp task 
exports.default = series(
  compilescss,
  jsmin,
  webpImage,
  watchTask,
);