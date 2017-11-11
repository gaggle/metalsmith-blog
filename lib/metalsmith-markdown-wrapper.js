'use strict'
const markdown = require('metalsmith-markdownit')

const isNunjucks = function (str) {
  return str.startsWith('{%')
}
module.exports = function () {

  const md = markdown('default', {html: true})

  const old_text = md.parser.renderer.rules.text
  md.parser.renderer.rules.text = (tokens, idx, options, env, self) => {
    const rootToken = tokens[0]
    if (isNunjucks(rootToken.content)) {
      return tokens[idx].content
    }
    return old_text(tokens, idx, options, env, self)
  }

  md.parser.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    const content = token.content
    const lang = token.info ? `lang:${token.info} ` : ''
    return `<p>{% code ${lang}%}${content}{% endcode %}</p>`
  }

  return md
}
