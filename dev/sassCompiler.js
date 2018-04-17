"use strict"


var fs = require('fs'),
    sass = require('node-sass'),
    postcss = require('postcss'),
    autoprefixer = require('autoprefixer');
    
function compileSass(c) {
    if(!compileSass.watchList) {
        compileSass.watchList = {};
    }
    if(c.fileName.startsWith('_')) {
        return
    }
    var result = sass.renderSync({
        file: c.filePath+c.fileName,
        outputStyle: "expanded"
    })
    result.stats.includedFiles.forEach(includedFile => {
        if(!compileSass.watchList[includedFile]) {
            compileSass.watchList[includedFile] = [];
        }
        if(!compileSass.watchList[includedFile][c.filePath+c.fileName]) {
            compileSass.watchList[includedFile][c.filePath+c.fileName] = c
        }
    });
    var inputFile = c.filePath+c.fileName;
    var outputFile = c.filePath+c.fileName.replace('.scss', '.css');
    var supportedBrowsers = [
        "> 1%",
        "last 2 versions",
        "iOS 8.1"
    ];
     
    var processor = postcss([
        autoprefixer({
            PostCSS: undefined,
            browsers: supportedBrowsers
        })
      ]);     
      processor.process(
            result.css.toString(),
            {
                from: undefined
            }
        ).then(
        function(result) {
            console.log('\x1b[32m%s\x1b[0m', 'rendering', inputFile);
            fs.writeFileSync(outputFile, result.css);
        },
        function(err) {
            console.error('Error: ' + err.message);
        }
    );
}

module.exports = compileSass