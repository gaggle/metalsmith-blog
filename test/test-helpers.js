'use strict'
const beautifyHtml = require('js-beautify').html
const fs = require('fs-extra')
const glob = require('glob')
const Metalsmith = require('metalsmith')
const path = require('path')

exports.beautifyFolder = function (dir) {
  return findFiles(dir, '**/*.html')
    .then(function (files) {
      return Promise.all(files.map(beautifyFile))
    })
}

exports.buildMetalsmith = function (src, dst, middleware) {
  const metalsmith = new Metalsmith('test/fixtures')
  return new Promise(function (resolve, reject) {
    metalsmith
      .source(src)
      .destination(dst)
      .use(middleware)
      .build(err => {
        if (err) return reject(err)
        resolve()
      })
  })
}

const findFiles = function (dir, pattern) {
  return new Promise(function (resolve, reject) {
    glob(path.join(dir, pattern), {absolute: true}, (err, files) => {
      err ? reject(err) : resolve(files)
    })
  })
}

const beautifyFile = function (file) {
  return fs.readFile(file, 'utf8')
    .then(data => beautifyHtml(data, {indent_size: 2, end_with_newline: true}))
    .then(data => fs.writeFile(file, data, 'utf8'))
}
