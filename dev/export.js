var rimraf          = require('rimraf'),
    fs              = require('fs'),
    path            = require('path'),
    template        = require('./template'),
    find            = require('./find'),
    checkDir        = require('./checkDir'),
    list            = [];

console.log("root ", process.env.rootDir)
find(process.env.rootDir+'/'+ process.env.templateDir, '.hbs', template.registerPartial);

function xPort () {
    var tplStr,
        distPath,
        assets;
    rimraf(process.env.rootDir+'/dist/', function() {
        find(process.env.rootDir+'/components/' , 'index.html', c => {
            distPath = c.filePath.replace(process.env.rootDir, process.env.rootDir+'/'+process.env.exportDir)

            checkDir (distPath)
            tplStr = template(c.filePath+c.fileName);
            fs.writeFileSync(distPath+c.fileName, tplStr)
        });
        copyAssets (process.env.rootDir+'/assets/')
        copyAssets (process.env.rootDir+'/assets_dev/')
        // copyAssets (process.env.rootDir+'/ui/')
        copyAssets (process.env.rootDir+'/components/')
        var str = template(process.env.rootDir+'/index.html')
        fs.writeFileSync(process.env.rootDir+'/'+process.env.exportDir+'/index.html', str)

    });
}

function copyAssets (srcDir) {
    var distDir = srcDir.replace(process.env.rootDir, process.env.rootDir+'/'+process.env.exportDir)
    checkDir (distDir)
    var bundle = fs.readdirSync( srcDir )
        .filter( function( elm ) {return elm.match(/.*\.(css)|.*\.(svg)|.*\.(jpg)|.*\.(png)|.*\.(woff)|.*\.(js)|.*\.(hbs)|.*\.(fs)|README.md/ig);})
        .filter( function( elm ) {return !elm.match(/.*\.(data.js)|assets.js/ig);})
    bundle.forEach(e => {
        fs.createReadStream(srcDir + e).pipe(fs.createWriteStream(srcDir.replace(process.env.rootDir, process.env.rootDir+'/'+process.env.exportDir) + e));
    });
    getFolders(srcDir).forEach(copyAssets)
}
function getFolders(baseFolder) {
    var exclude = ['ctt2000'];
    var folderList = [];
    var folders = fs.readdirSync(baseFolder).filter(file => fs.statSync(path.join(baseFolder, file)).isDirectory());
    folders.forEach(folder => {
        if(exclude.indexOf(folder) > -1) {
            return
        }
        folderList.push(path.join(baseFolder,folder)+path.sep);
    });
    return folderList;
}

module.exports = xPort