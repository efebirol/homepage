"use strict"

var fs = require('fs'),
    path = require('path'),
    find = require('./find'),
    config = {};

function transpileModule (c) {
    var config = ['twig', 'hbs', 'fs'],
        i,
        dataPath,
        content,
        pathToSrcFile = c.filePath + c.fileName,
        configFile,
        base_content = fs.readFileSync(pathToSrcFile, "utf8");
    config.forEach(e => {
        dataPath = c.filePath.replace(process.env.rootDir, process.env.rootDir +'/'+ process.env.transileDataDir +'/'+ e ) + c.fileName.replace('.src.html', '.js')
        if (!fs.existsSync(dataPath)) {
            return
        }
        if(!config[e]) {
            config[e] = {};
        }
        content = base_content;
        ;
        delete require.cache[require.resolve(dataPath)]
        config[e][pathToSrcFile] = require(dataPath)
        for(i in config[e][pathToSrcFile]) {
            content = content.replace(new RegExp('{{\\s*'+i+'\\s*}}', 'g'), config[e][pathToSrcFile][i])
        }
        fs.writeFileSync(pathToSrcFile.replace('.src.html', '.'+e ), content);
    });
}

module.exports = transpileModule