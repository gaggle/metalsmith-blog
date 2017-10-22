'use strict'
const markdown = require('metalsmith-markdown')
const marked = require('marked')

module.exports = function () {
  const renderer = new marked.Renderer()
  renderer.code = function (code, lang) {
    const langStr = lang ? `lang:${lang}` : ''
    return `{% code ${langStr}%}${code}{% endcode %}`
  }
  return markdown({renderer: renderer})
}
