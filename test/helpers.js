'use strict'
const path = require('path')
const recursiveReaddirSync = require('recursive-readdir-sync')

/**
 * @param {string} dir
 */
exports.walkFixtures = function * (dir) {
  dir = path.resolve(__dirname, dir)

  const data = {}

  for (let filepath of recursiveReaddirSync(dir)) {
    let sourceDir = path.dirname(filepath)
    if (!sourceDir.endsWith('source')) continue
    let parentDir = path.dirname(sourceDir)
    let name = path.basename(parentDir)

    data[name] = parentDir
  }

  for (let name of Object.keys(data)) {
    yield [name, data[name]]
  }
}
