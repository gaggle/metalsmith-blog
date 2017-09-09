/* global describe, it */
'use strict'
const assertDir = require('assert-dir-equal')
const Metalsmith = require('metalsmith')
const path = require('path')

const helpers = require('./helpers')
const blog = require('../lib/index')

describe('metalsmith-blog', function () {
  for (let [name, dir] of helpers.walkFixtures('./fixtures')) {
    describe(name, function () {  // eslint-disable-line no-loop-func
      it(name, function () {
        return assertMetalsmithBuildEquals(
          {
            layout: {
              default: 'default.pug',
              directory: '.',
              inplace: require('nunjucks-tags-typography')
            }
          },
          path.join(dir),
          path.join(dir, 'expected')
        )
      })
    })
  }
})

const assertMetalsmithBuildEquals = function (opts, dir, expected) {
  let dst = path.join(dir, 'build')
  return buildMetalsmith(path.join(dir, 'source'), dst, opts)
    .then(function () {
      assertDir(dst, expected, {filter: () => true})
    })
}

const buildMetalsmith = function (src, dst, opts) {
  const metalsmith = new Metalsmith('test/fixtures')
  return new Promise(function (resolve, reject) {
    metalsmith
      .source(src)
      .destination(dst)
      .use(blog(opts))
      .build(err => {
        if (err) return reject(err)
        resolve()
      })
  })
}
