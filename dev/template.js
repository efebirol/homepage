"use strict"

var fs = require('fs'),
  path = require('path'),
  Handlebars = require('handlebars'),
  find = require('./find');

function getAssets (tplPath) {
  var assetPath = tplPath,
    data;
  assetPath = assetPath.split(path.sep)
  assetPath.pop()
  assetPath = assetPath.join(path.sep) + "/assets.js";
  if(fs.existsSync(assetPath)) {
    delete require.cache[require.resolve(assetPath)]
    data = require(assetPath);
    if(!data.css) {
      data.css = [];
    }
    if(!data.js) {
      data.js = [];
    }

    // push to assets
    if(data.demoAssets) {
      if(data.demoAssets.css && data.demoAssets.css.length) {
        data.demoAssets.css.forEach(v => {
          if(!data.css.indexOf(v) > -1 ) {
            data.css.push(v)
          }
        });
      }
      if(data.demoAssets.js && data.demoAssets.js.length) {
        data.demoAssets.js.forEach(v => {
          if(!data.js.indexOf(v) > -1 ) {
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

function compileTemplate(tplPath) {
    var tpl = Handlebars.compile(fs.readFileSync(tplPath,'utf8')),
      dataPath = tplPath.replace(path.extname(tplPath), process.env.dataExtension),
      data,
      assetData = getAssets(tplPath);
      if (!fs.existsSync(dataPath)) {
        data = {}
      } else {
        delete require.cache[require.resolve(dataPath)]
        data = require(dataPath)
      }
      if(assetData) {
        if(!data.assets) {
          data.assets = {};
        }
        data.assets.css = assetData.css ? assetData.css : [];
        data.assets.js = assetData.js ? assetData.js : [];
      }
    return tpl(data);
}

/* helpers start */

Handlebars.registerHelper("setProp", function(target, prop, value, options)
{
    target[prop] = value;
});


Handlebars.registerHelper('set', function(v1, v2) {
  this[v1] = v2;
});


Handlebars.registerHelper("inc", function(target, value, options)
{
  target[value] = parseInt(target[value])+1
});

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context, null, 4);
});

Handlebars.registerHelper('raw', function(context) {
  return new Handlebars.SafeString(context);
});
function doLog(s) { // for debugging partials
  console.log(s)
}
Handlebars.registerHelper('include', function(path, data) {
  if(data) {
    if(typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch(e) {
        data = data
      }
    }
  } else {
    data = {}
  }
  // data = data ? typeof data === 'string' ? JSON.parse(data) : data : {}
  var tpl = Handlebars.compile(fs.readFileSync(path,'utf8'));
  return new Handlebars.SafeString(tpl(data))
});
compileTemplate.registerPartial = (c) => {
  var tpl = fs.readFileSync(c.filePath+c.fileName, 'utf8');
  Handlebars.registerPartial(c.fileName.replace(path.extname(c.fileName), ''), tpl)
}
/* helpers end */

module.exports = compileTemplate