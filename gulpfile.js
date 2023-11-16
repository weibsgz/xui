const gulp = require('gulp');
const glob = require("glob");
const {
  series
} = require('gulp')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const minifyCSS = require('gulp-minify-css')

// 将 static/css/  scss 文件打包成一个文件
function sass2css(cb) {
  gulp.src(['./dist/static/css/_reset.scss', './dist/static/css/_helpers.scss'])
    .pipe(concat('xAllCommon.min.scss'))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/css'))
  cb()
}
// 将 dist/css 文件打包成一个文件
function all2oneCss(cb) {
  setTimeout(() => {
    gulp.src('./dist/css/x*.min.css')
      .pipe(concat('x-ui.min.css'))
      .pipe(gulp.dest('./dist/css/'))
    cb()
  }, 150);
}
// 将 dist/js 文件打包成一个文件 
function all2oneJs(cb) {
  gulp.src(['./dist/js/bundle.min.js', './dist/js/common.min.js', './dist/js/x*.min.js'])
    .pipe(concat('x-ui.min.js'))
    .pipe(gulp.dest('./dist/js/'));
  cb()
}
// 将组件文件js 打包一个可以单独引用的文件
function single(cb) {
  let files = glob.sync('./dist/js/x*.min.js')
  let reg = /(x\w+)/g
  let components = files.map(item => item.match(reg)[0])
  components.forEach((file) => {
    gulp.src(['./dist/js/bundle.min.js', './dist/js/common.min.js', `./dist/js/${file}.min.js`])
      .pipe(concat(`${file}.single.js`))
      .pipe(gulp.dest('./dist/js/single'));
  })
  cb()
}
exports.generate = series(sass2css, all2oneCss, all2oneJs, single);