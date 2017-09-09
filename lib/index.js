'use strict'
const collections = require('metalsmith-collections')
const each = require('metalsmith-each')
const markdown = require('metalsmith-markdown')
const merge = require('merge')
const nunjucks = require('metalsmith-nunjucks')
const once = require('metalsmith-once')
const permalinks = require('metalsmith-permalinks')
const puglayout = require('metalsmith-puglayout')
const Resolver = require('metalsmith-plugin-resolver')
const slug = require('metalsmith-slug')
const typeset = require('metalsmith-typeset')

module.exports = function (opts) {
  opts = merge.recursive(true, {
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
  }, opts)
  return function (files, metalsmith, done) {
    const resolver = new Resolver(files, metalsmith)

    resolver
      .use(slug({lower: true}))
      .use(nunjucks({
        config: {
          titlecase: true,
          highlight: {enable: true, tab_replace: true}
        }
      }, opts.layout.inplace))
      .use(markdown({
        gfm: true, // GitHub flavored markdown
        smartypants: false, // smart quotes and dashes
        tables: true // GFM tables
      }))
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
        move: true
      }))
      .use(puglayout({
        default: opts.layout.default,
        directory: opts.layout.directory,
        globals: opts.layout.globals
      }))
      .use(typeset())
      .run(done)
  }
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

const trySetProperty = function (obj, prop, value = undefined) {
  if (obj.hasOwnProperty(prop)) return
  obj[prop] = value
}

const addLayoutToPosts = function (files, ms) {
  ms.metadata().collections.posts.forEach(el => {
    if (el.layout === undefined) { el.layout = this.layout }
  })
}
