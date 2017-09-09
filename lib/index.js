"use strict";
const collections = require("metalsmith-collections")
const each = require("metalsmith-each")
const merge = require("merge")
const nunjucks = require("metalsmith-nunjucks")
const once = require("metalsmith-once")
const permalinks = require("metalsmith-permalinks")
const puglayout = require("metalsmith-puglayout")
const Resolver = require("metalsmith-plugin-resolver")
const slug = require("metalsmith-slug")

module.exports = function (opts) {
  opts = merge.recursive(true, {
    sources: undefined,
    pattern: ":title",
    date: "YYYY",
    layout: {
      default: "empty",
      directory: "layouts",
      globals: undefined,
      inplace: undefined,
      posts: "post",
    },
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
      .use(collections({posts: opts.sources}))
      .use(once(addLayoutToPosts, {layout: opts.layout.posts}))
      .use(each(enhanceCollectedFiles))
      .use(permalinks({
          linksets: [
            {
              match: {collection: "posts"},
              pattern: opts.pattern,
            }
          ],
          relative: "folder",
          date: opts.date,
          deleteSources: true,
        }
      ))
      .use(puglayout({
        default: opts.layout.default,
        directory: opts.layout.directory,
        globals: opts.layout.globals,
      }))
      .run(done)
  }
}

const enhanceCollectedFiles = function (file) {
  if (file.collection === undefined || file.collection.length === 0)
    return
  trySetProperty(file, "author", "gaggle")
  trySetProperty(file, "next", null)
  trySetProperty(file, "previous", null)
  trySetProperty(file, "published", "true")
}

const trySetProperty = function (obj, prop, value = undefined) {
  if (obj.hasOwnProperty(prop)) return
  obj[prop] = value
}

const addLayoutToPosts = function (files, ms) {
  ms.metadata().collections.posts.forEach(el => {
    if (el.layout === undefined)
      el.layout = this.layout
  })
}
