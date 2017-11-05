/* global describe, it */
'use strict'
const assertDir = require('assert-dir')
const merge = require('lodash.merge')
const path = require('path')
const xmlcompare = require('xmlcompare')

const blog = require('../lib/index')

const helpers = require('./test-helpers')

describe('metalsmith-blog', function () {
  it('basic', function () {
    return assertFixture(this.test.title)
  })

  it('code', function () {
    return assertFixture(this.test.title)
  })

  it('custom-layout', function () {
    return assertFixture(this.test.title, {
      layout: {directory: 'custom-layout/templates'},
      sources: ['**/*']
    })
  })

  it('embeddings', function () {
    return assertFixture(this.test.title)
  })

  it('links', function () {
    return assertFixture(this.test.title)
  })

  it('markdown-in-tags', function () {
    return assertFixture(this.test.title)
  })

  it('more', function () {
    return assertFixture(this.test.title)
  })

  it('move', function () {
    return assertFixture(this.test.title, {
      layout: {directory: 'move/templates'},
      pattern: 'foo',
      sources: ['**/*']
    })
  })

  it('quotes', function () {
    return assertFixture(this.test.title)
  })

  it('rewrites-links', function () {
    return assertFixture(this.test.title, {
      layout: {directory: 'rewrites-links/templates'},
      pattern: 'blog/:title',
      sources: ['**/*'],
      relink: true
    })
  })

  it('typesetting', function () {
    return assertFixture(this.test.title)
  })
})

const assertFixture = function (fixture, opts) {
  const dir = path.resolve(path.join('test', 'fixtures', fixture))
  opts = merge({
    layout: {
      default: 'default.pug',
      directory: '.',
      inplace: require('nunjucks-tags-typography')
    }
  }, opts)

  const dst = path.join(dir, 'build')
  const expected = path.join(dir, 'expected')
  return helpers.buildMetalsmith(path.join(dir, 'source'), dst, blog(opts))
    .then(() => assertDir(dst, expected, [['**/*.html', DOMCompare]]))
}

const DOMCompare = function (file, actualPath, expectedPath, actualData, expectedData) {
  xmlcompare(actualData, expectedData, {
    ignoreEmpty: true,
    ignoreWarnings: true
  })
}
