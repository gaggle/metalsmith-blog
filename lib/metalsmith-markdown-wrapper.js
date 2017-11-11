'use strict'
const Entities = require('html-entities').XmlEntities

const markdown = require('./metalsmith-markdown-it-8')
const nunjucksPlugin = require('./markdown-it-nunjucks')

const isNunjucks = function (str) {
  return str.startsWith('{%')
}
module.exports = function () {

  const md = markdown('default', {html: true})
  // md.parser.use(nunjucksPlugin)

  const old_text = md.parser.renderer.rules.text
  md.parser.renderer.rules.text = (tokens, idx, options, env, self) => {
    const rootToken = tokens[0]
    if (isNunjucks(rootToken.content)) {
      return tokens[idx].content
    }
    return old_text(tokens, idx, options, env, self)
  }

  const old_fence = md.parser.renderer.rules.fence
  md.parser.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const content = token.content
    const lang = token.info ? `lang:${token.info} ` : ''
    return `<p>{% code ${lang}%}${content}{% endcode %}</p>`
    return old_fence(tokens, idx, options, env, slf)
    return content
  }

  return md

  // const renderer = new marked.Renderer()
  // renderer.code = function (code, lang) {
  //   const langStr = lang ? `lang:${lang} ` : ''
  //   return `{% code ${langStr}%}\n${code}\n{% endcode %}\n`
  // }
  // renderer.text = function (text) {
  //   return marked.Renderer.prototype.text(entities.decode(text))
  // }
  // renderer.paragraph = function (text) {
  //   if (text.startsWith('{%')) {
  //     return `${text}\n`
  //   } else {
  //     return marked.Renderer.prototype.paragraph(text)
  //   }
  // }
  // return markdown({renderer: renderer})
}

// renderer.heading = function (text, level) {
//   var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
//
//   return '<h' + level + '><a name="' +
//     escapedText +
//     '" class="anchor" href="#' +
//     escapedText +
//     '"><span class="header-link"></span></a>' +
//     text + '</h' + level + '>';
// },

// const lexer = new marked.Lexer(options);
// const tokens = lexer.lex(text);
// console.log(tokens);
// console.log(lexer.rules);

