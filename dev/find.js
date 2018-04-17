"use strict"
var fs = require('fs'),
  path = require('path'),
  list = false;

function fromDir(startPath, filter, cb, exclude) {
  if(!list) {
    list = [];
  }
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter, cb, exclude); //recurse
    }
    else {
      if(exclude) {
        if (filename.endsWith(filter) && !filename.endsWith(exclude)) {
          var filePath = filename.split('/').slice(0, -1).join("/")+"/",
            fileName = filename.replace(filePath, '');
          cb({
            filePath: filePath,
            fileName: fileName
          })
        };
      } else {
        if (filename.indexOf(filter) >= 0) {
          var filePath = filename.split('/').slice(0, -1).join("/")+"/",
            fileName = filename.replace(filePath, '');
          cb({
            filePath: filePath,
            fileName: fileName
          })
        };
      }
    }
  };
};

module.exports = fromDir