'use strict'
const collections = require('metalsmith-collections')
const each = require('metalsmith-each')
const merge = require('lodash.merge')
const nunjucks = require('metalsmith-nunjucks')
const once = require('metalsmith-once')
const permalinks = require('metalsmith-permalinks')
const puglayout = require('metalsmith-puglayout')
const Resolver = require('metalsmith-plugin-resolver')
const slug = require('metalsmith-slug')
const typeset = require('metalsmith-typeset')

const ensurePathIsRooted = require('./root-path')
const markdown = require('./metalsmith-markdown-wrapper')
const trySetProperty = require('./try-set-property')

module.exports = function (opts) {
  opts = normaliseOpts(opts)

  return function (files, metalsmith, done) {
    const resolver = new Resolver(files, metalsmith)

    resolver
      .use(slug({lower: true}))
      .use(markdown())
      .use(nunjucks({
        config: {
          titlecase: true,
          highlight: {tab_replace: true},
          asset_img: ensurePathIsRooted
        }
      }, opts.layout.inplace))
      .use(collections({posts: opts.sources}))
      .use(once(addLayoutToPosts, {layout: opts.layout.posts}))
      .use(each(enhanceCollectedFiles({author: opts.layout.default_author})))
      .use(permalinks({
        linksets: [
          {
            match: {collection: 'posts'},
            pattern: opts.pattern
          }
        ],
        relative: 'folder',
        date: opts.date,
        move: true,
        relink: true
      }))
      .use(puglayout({
        default: opts.layout.default,
        directory: opts.layout.directory,
        globals: opts.layout.globals
      }))
      .use(typeset({disable: ['hyphenate']}))
      .run(done)
  }
}

const addLayoutToPosts = function (files, ms) {
  ms.metadata().collections.posts.forEach(el => {
    if (el.layout === undefined) { el.layout = this.layout }
  })
}

const enhanceCollectedFiles = function (opts) {
  return function (file) {
    if (file.collection === undefined || file.collection.length === 0) { return }
    trySetProperty(file, 'author', opts.author)
    trySetProperty(file, 'next', null)
    trySetProperty(file, 'previous', null)
    trySetProperty(file, 'published', 'true')
  }
}

const normaliseOpts = function (opts) {
  const defaults = {
    sources: [],
    pattern: ':title',
    date: 'YYYY',
    layout: {
      default: 'empty',
      directory: 'layouts',
      globals: undefined,
      inplace: undefined,
      posts: 'post',
      default_author: undefined
    }
  }
  return merge(defaults, opts)
}
