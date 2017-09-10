/* global describe, it */
'use strict'
const assertDir = require('assert-dir-equal')
const Metalsmith = require('metalsmith')
const path = require('path')
const merge = require('lodash.merge')

const blog = require('../lib/index')

describe('metalsmith-blog', function () {
  it('basic', function () {
    return assertMetalsmithBuildEquals(this.test.title)
  })

  it('code', function () {
    return assertMetalsmithBuildEquals(this.test.title)
  })

  it('codequotes', function () {
    return assertMetalsmithBuildEquals(this.test.title)
  })

  it('custom-layout', function () {
    return assertMetalsmithBuildEquals(this.test.title, {
      layout: {directory: 'custom-layout/templates'},
      sources: ['**/*']
    })
  })

  it('move', function () {
    return assertMetalsmithBuildEquals(this.test.title, {
      layout: {directory: 'move/templates'},
      pattern: 'foo',
      sources: ['**/*']
    })
  })

  it('quotes', function () {
    return assertMetalsmithBuildEquals(this.test.title)
  })

  it('rewrites-links', function () {
    return assertMetalsmithBuildEquals(this.test.title, {
      layout: {directory: 'rewrites-links/templates'},
      pattern: 'blog/:title',
      sources: ['**/*'],
      relink: true
    })
  })
})

const assertMetalsmithBuildEquals = function (fixture, opts) {
  const dir = path.resolve(path.join('test', 'fixtures', fixture))
  opts = merge({
    layout: {
      default: 'default.pug',
      directory: '.',
      inplace: require('nunjucks-tags-typography')
    }
  }, opts)

  let dst = path.join(dir, 'build')
  return buildMetalsmith(path.join(dir, 'source'), dst, opts)
    .then(function () {
      assertDir(dst, path.join(dir, 'expected'), {filter: () => true})
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
