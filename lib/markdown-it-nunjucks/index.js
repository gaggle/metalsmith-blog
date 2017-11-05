'use strict'
const nunjucksReplace = function (md) {
  const arrayReplaceAt = md.utils.arrayReplaceAt
  const pattern = /{%(.*)%}(.*)/

  const processState = function (state) {
    for (let token of state.tokens) {
      if (token.type !== 'inline') continue

      let children = token.children
      let i = children.length - 1
      while (i >= 0) {
        const token = children[i]
        children = arrayReplaceAt(children, i, splitTextToken(token, state.Token))
        i--
      }
      token.children = children
    }
  }

  const splitTextToken = function (original, Token) {
    const text = original.content
    const matches = text.match(pattern)
    if (matches === null) {
      return original
    }
    return createTokens(text, Token)
  }

  const createTokens = function (text, Token) {
    let token
    token = new Token('text', '', 0)
    token.content = text
    return token
  }

  return processState
}

module.exports = function (md, options) {
  md.core.ruler.push('nunjucks', nunjucksReplace(md, options))
}
