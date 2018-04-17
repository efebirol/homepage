"use strict"
var fs = require('fs')

function watcher(target, callback, args, preventReload) {
  fs.watchFile(target, {interval: 500}, (curr, prev) => {
      if(args) {
        callback(args)
      } else {
        callback()
    }
    if(preventReload) {
      return
    }
    watcher.io.emit('reload')
  });
}

module.exports = watcher