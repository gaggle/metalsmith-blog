'use strict'
const markdown = require('metalsmith-markdown')
const marked = require('marked')
const Entities = require('html-entities').XmlEntities

const entities = new Entities()

module.exports = function () {
  const renderer = new marked.Renderer()
  renderer.code = function (code, lang) {
    const langStr = lang ? `lang:${lang} ` : ''
    return `{% code ${langStr}%}\n${code}\n{% endcode %}\n`
  }
  renderer.text = function (text) {
    return marked.Renderer.prototype.text(entities.decode(text))
  }
  renderer.paragraph = function (text) {
    if (text.startsWith('{%')) {
      return `${text}\n`
    } else {
      return marked.Renderer.prototype.paragraph(text)
    }
  }
  return markdown({renderer: renderer})
}
