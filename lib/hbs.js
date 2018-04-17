/** 
 * plase install handlebars to use this boilerplate
 * ( npm install handlebars )
 */

var fs = require('fs'),
    handlebars = require('handlebars'),
    path = require('path');


/**
 * use for debugging in handlebar templates like:
 * {{ json myObject }}
 */
handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context, null, 4);
});


/**
 * registers a handlebar template as partial
 * for example my/partial/dir/myPartial.hbs
 * will be availeble like {{> myPartial }}
 */
function registerPartial(context, object, softPackConfig) {
    handlebars.registerPartial(object.fileName.replace(path.extname(object.fileName), ''), context)
}

/**
 * will compile a handlebar templated
 * tries to load a json file located in the same directory like the template
 * with the same name but with '.json' extension
 */
function renderTempalte(context, object, softPackConfig) {
    var tpl = handlebars.compile(context),
        data = {},
        dataPath = object.fullPath.replace(path.extname(object.fileName), '.data.js')
    if (fs.existsSync(dataPath)) {
        delete require.cache[dataPath]
        data = require(dataPath);
    }
    /** 
     * get assets
     */
    var assetData = getAssets(object.fullPath);
    if (assetData) {
        if (!data.assets) {
            data.assets = {};
        }
        data.assets.css = assetData.css ? assetData.css : [];
        data.assets.js = assetData.js ? assetData.js : [];
    }
    return tpl(data);
}

/**
 * some helpers
 */
handlebars.registerHelper('set', function (v1, v2) {
    this[v1] = v2;
});
handlebars.registerHelper("setProp", function (target, prop, value, options) {
    target[prop] = value;
});
handlebars.registerHelper("inc", function (target, value, options) {
    target[value] = parseInt(target[value]) + 1
});

handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context, null, 4);
});

handlebars.registerHelper('raw', function (context) {
    return new handlebars.SafeString(context);
});


function getAssets(tplPath) {
    var assetPath = tplPath,
        data;
    assetPath = assetPath.split(path.sep)
    assetPath.pop()
    assetPath = assetPath.join(path.sep) + "/assets.js";
    if (fs.existsSync(assetPath)) {
        delete require.cache[require.resolve(assetPath)]
        data = require(assetPath);
        if (!data.css) {
            data.css = [];
        }
        if (!data.js) {
            data.js = [];
        }

        // push to assets
        if (data.demoAssets) {
            if (data.demoAssets.css && data.demoAssets.css.length) {
                data.demoAssets.css.forEach(v => {
                    if (!data.css.indexOf(v) > -1) {
                        data.css.push(v)
                    }
                });
            }
            if (data.demoAssets.js && data.demoAssets.js.length) {
                data.demoAssets.js.forEach(v => {
                    if (!data.js.indexOf(v) > -1) {
                        data.js.push(v)
                    }
                });
            }
        }
        return data;
    } else {
        return false
    }

}

/**
 * export
 */
module.exports = {
    handlebars: handlebars,
    registerPartial: registerPartial,
    render: renderTempalte
}
