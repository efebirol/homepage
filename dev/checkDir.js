"use strict"
var fs = require('fs'),
  path = require('path');
function buildDir(pathName) {
  if (pathName) {
    pathName = buildDir.root+pathName
    pathName
      .split("/")
      .reduce((currentPath, folder) => {
        if(currentPath) {
          if (!fs.existsSync(currentPath)){
            fs.mkdirSync(currentPath);
          }
        }
        currentPath += path.sep + folder;
        return currentPath;
      })
  }
}
buildDir.root = ""
module.exports = buildDir