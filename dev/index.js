
"use strict"

var args            = process.argv.splice(2)
var config          = require('./../dev.config');


var path = require('path')
for(var i in config) {
    process.env[i] = config[i]
}
process.env.dataExtension ? process.env.dataExtension : '.data.json';


var find            = require('./find'),
    transpile       = require('./transpile'),
    template       = require('./template'),
    server          = require('./server'),
    sassCompiler    = require('./sassCompiler'),
    watch           = require('./watch');

console.log('this script is depricated');
console.log('please use "npm run start"');
process.exit()
if(args.indexOf('export') > -1) {
    process.env.export = true;
    console.log("start export")
    require('./export')()
    console.log("export done")
} else if(!args.length) {
    if(process.env.LOGNAME) {
        console.log("hello", process.env.LOGNAME)
    }
    watch.io = server();
    find(process.env.rootDir+'/'+ process.env.templateDir, '.src.html', function(c) { // transpile all .src.html and watch changes
        transpile(c);
        watch(c.filePath+c.fileName, transpile, c, true)
    });
    find(process.env.rootDir+'/'+ process.env.templateDir, '.hbs', function(c) { // transpile all .src.html and watch changes
        template.registerPartial(c);
        watch(c.filePath+c.fileName, template.registerPartial, c)
    });
    find(process.env.rootDir+'/'+process.env.templateDir, '.scss', sassCompiler)
    find(process.env.rootDir+'/assets_dev', '.scss', sassCompiler)
    find(process.env.rootDir+'/assets', '.scss', sassCompiler)
    
    for(var i in sassCompiler.watchList) {
        for( var o in sassCompiler.watchList[i]) {
            watch(i, sassCompiler, sassCompiler.watchList[i][o])
        }
    }

    console.log("server ready")
}