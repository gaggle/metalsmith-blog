'use strict'

module.exports = function (obj, prop, value = undefined) {
  if (obj.hasOwnProperty(prop)) return
  obj[prop] = value
}
