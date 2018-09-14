const gulp = require('gulp')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const { join } = require('path')

// Html
const pug = require('gulp-pug')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

// Style
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const globImporter = require('node-sass-glob-importer')
const sassImporters = [globImporter()]
const autoprefixer = require('gulp-autoprefixer');
const autoPrefixerSetting = {
  browsers: ['last 5 versions', 'ie >= 11', 'Android >= 4.4','ios_saf >= 8'],
  cascade: false
}

// Js
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

// Gulp task
const del = require('del')
const { create: createbrowserSync } = require('browser-sync')
const bs = createbrowserSync()

// Setting
const basePath = '/'
const destDir = 'public'


const html = () => {
  return gulp
    .src(['src/html/**/*.pug', '!' + 'src/html/**/_*.pug'])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(pug({
      basedir: '../src',
      pretty: true
    }))
    .pipe(gulp.dest(destDir))
}

const css = () => {
  return gulp
    .src('./src/scss/style.scss')
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(sass({ importer: sassImporters, outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer(autoPrefixerSetting))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(join(destDir, 'css')))
}

const js = (done) => {
  const compiler = webpack(webpackConfig)
  let isFirst = true

  const callback = (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      })
    )

    if (isFirst) {
      done()
      isFirst = false
      return
    }

    bs.reload('*.js')
  }

  compiler.watch({}, callback)
}


const serve = (done) => {
  bs.init(
    {
      notify: false,
      ui: false,
      server: {
        baseDir: [destDir],
        routes: {
          [basePath]: 'public',
        },
      },
      startPath: join(basePath, '/'),
      ghostMode: false,
      open: false,
    },
    done
  )
}

const clean = () => {
  return del(destDir)
}

const watch = (done) => {
  const options = {
    delay: 50,
  }

  const reload = (done) => {
    bs.reload()
    done()
  }

  gulp.watch('src/scss/**/*.scss', options, css)
  gulp.watch('src/html/**/*.pug', options, html)
  done()
}

// prettier-ignore
gulp.task('default', gulp.series(
  clean,
  gulp.parallel(html, css, js),
  serve,
  watch
))
