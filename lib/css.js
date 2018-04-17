/** 
 * plase install node-sass, autoprefixer and postcss to use this boilerplate
 * ( npm install babel-core babel-preset-es2015 )
 */


var nodeSass = require('node-sass');
var autoprefixer = require('autoprefixer');
var postcss = require('postcss');


/**
 * pass css code to get browser prefixes 
 */
function prefix(context) {
    var postcss = require('postcss');
    var autoprefixer = require('autoprefixer');
    return postcss([autoprefixer({
        from: undefined,
        browsers: [
            "> 1%",
            "last 2 versions",
            "iOS 8.1"
        ],
        flexbox: true
    })]).process(context).css;
}

/**
 * render scss to css
 */
function renderSass(context, object) {
    var result = nodeSass.renderSync({
        file: object.fullPath, // use filename to enable import statements
        outputStyle: "expanded"
    })
    return result.css
}

/**
 * export
 */
module.exports = {
    nodeSass: nodeSass,
    autoprefixer: autoprefixer,
    postcss: postcss,
    render: renderSass,
    prefix: prefix
};
