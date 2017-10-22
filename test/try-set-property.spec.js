/* global describe, it */
'use strict'
const assert = require('assert')

const trySetProperty = require('../lib/try-set-property')

describe('try-set-property', function () {
  it('sets property', function () {
    const obj = {}
    trySetProperty(obj, 'foo', 'bar')
    assert.equal(obj.foo, 'bar')
  })

  it('does not overwrite existing property', function () {
    const obj = {foo: 'spam'}
    trySetProperty(obj, 'foo', 'bar')
    assert.equal(obj.foo, 'spam')
  })
})
