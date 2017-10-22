/* global describe, it */
'use strict'
const assert = require('assert')

const rootPath = require('../lib/root-path')

describe('root-path', function () {
  it('adds forwardslash to path', function () {
    assert.equal(rootPath('foo'), '/foo')
  })

  it('does nothing if path already has forwardslash', function () {
    assert.equal(rootPath('/foo'), '/foo')
  })
})
