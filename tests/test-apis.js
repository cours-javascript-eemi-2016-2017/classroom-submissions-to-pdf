var async = require('async')

var fetchers = {
  jsfiddle: function(sourceIds, callback) {
    require('jsfiddle').getFiddle(sourceIds[0], callback)
  },
  jsbin: function(sourceIds, callback) {
    var JsbinClient = require("jsbin-client")
    var jsbin = new JsbinClient({})
    jsbin.read(sourceIds[0], sourceIds[1]).then(function(data) {
      callback(null, data)
    }, function(error) {
      callback(error, data)
    })
  },
  codepen: function(sourceIds, callback) {
    var request = require('request')
    var penUrl = 'http://codepen.io/' + sourceIds[0] + '/pen/' + sourceIds[1]
    async.map(['html', 'js', 'css'], function(ext, callback) {
      request(penUrl + '.' + ext, function (error, response, content) {
        //if (!error && response.statusCode == 200)
        var obj = {}
        obj[ext] = content
        callback(error, obj)
      })
    }, function(err, results) {
      callback(err, Object.assign.apply(Object, results))
    })
  },
  fetchBySource: function(source, callback) {
    var sourceIds = source.slice() // clone array
    var sourceName = sourceIds.shift()
    this[sourceName].call(this, sourceIds, function(err, res) {
      res = res || {}
      callback(err, {
        source: source,
        js: res.js || res.javascript,
        css: res.css,
        html: res.html,
      })
    })
  }
}

async.parallel([

  function testJsFiddle(callback) {
    fetchers.fetchBySource([ 'jsfiddle', 'u8B29' ], callback)
  },

  function testJsBin(callback) {
    fetchers.fetchBySource([ 'jsbin', 'foxego', 6 ], callback)
  },

  function testCodePen(callback) {
    fetchers.fetchBySource([ 'codepen', 'adrienjoly', 'WRMWWO' ], callback)
  },

], function(err, results) {
  console.log(err || results.map(function(res) {
    return res.source + ' => ' + JSON.stringify(res, null, 2)//Object.keys(res).join(', ')
  }).join('\n'))
})
