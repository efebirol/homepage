"use strict"

/**
 * 
 * use node dev/backstop reference from rootDir to initialize.
 * 
 * use node dev/backstop to run test
 */


var backstop = require('backstopjs');
var command = process.argv[2];
var possible_commands = ['reference', 'test'];
var action = command ? command : 'test';
var path = require('path');

var find = require('./find');
var srcDir = path.resolve(__dirname, './..');
var split, modName, modPath;

var config = {
    config: {
        id: "screens",
        viewports: [
            {
                name: "desktop_ref",
                width: 1200,
                height: 1000
            },
            {
                name: "mobile_ref",
                width: 720,
                height: 1000
            }
        ],
        delay: 500,
        misMatchThreshold: "1%",
        scenarios: [],
        "paths": {
            "bitmaps_reference": path.resolve(srcDir, "dev/backstop_data/bitmaps_reference"),
            "bitmaps_test": path.resolve(srcDir, "dev/backstop_data/bitmaps_test"),
            "engine_scripts": path.resolve(srcDir, "dev/backstop_data/engine_scripts"),
            "html_report": path.resolve(srcDir, "dev/backstop_data/html_report"),
            "ci_report": path.resolve(srcDir, "dev/backstop_data/ci_report")
        }
    }
}

find(srcDir + path.sep + 'components' + path.sep, 'index.html', function (c) {
    split = c.filePath.split(path.sep).filter(Boolean);
    modName = split[split.length - 1];
    modPath = c.filePath.replace(srcDir, '');
    config.config.scenarios.push({
        label: modName,
        url: process.cwd()+ path.sep + 'dist' + modPath + 'index.html',
        referenceUrl: "http://development:d3v3l0pm3nt@components.zf.compuccino.net" + modPath + 'index.html'
    })
});

if (command) {
    if (!(possible_commands.indexOf(command) > -1)) {
        console.log("please use one of these options", possible_commands)
    } else {
        backstop(command, config);
    }
} else {
    backstop('test', config);
}