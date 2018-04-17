var softpack = require("softpack");
var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
var execSync = require("child_process").execSync;
var config,
  buildIgnores = [
    "assets_dev",
    "**/index.data.js",
    "**/assets.js",
    "**/*.src.html",
    "**/_*.scss"
  ];
if (fs.existsSync(path.resolve(__dirname, "config.local.js"))) {
  config = require("./config.local");
} else {
  config = require("./config");
}
if (process.argv.indexOf("build") > -1) {
  config.ignore = config.ignore.concat(buildIgnores);
  softpack.build(config);
} else if (process.argv.indexOf("ship") > -1) {
  var indexData = require("./../index.data");
  var deployList = require("./deployList");
  var removeList = [];
  indexData.components.forEach(e => {
    if (deployList.indexOf(e.path) === -1) {
      removeList.push(e.path);
    }
  });
  config.ignore = config.ignore.concat(buildIgnores);

  process.env.deploy = true;
  config.end = function() {
    removeList.forEach(e => {
      rimraf(path.resolve(process.cwd(), "dist", e), () => {});
    });
    // get current hash
    var currentDir,
      currentInfo,
      newHash = execSync("git rev-parse HEAD").toString();

    deployList.forEach(d => {
      currentDir = path.resolve(process.cwd(), d);
      currentInfo = require(path.resolve(currentDir, "info.json"));
      if(currentInfo.releaseHashes) {
        diffFilesinDir(currentDir, currentInfo);
      } else {
        currentInfo.releaseHashes = []
      }
      if(!currentInfo.releases) {
        currentInfo.releases = []
      }
      currentInfo.releases.unshift(getCurrentDate());
      currentInfo.releaseHashes.unshift(newHash.replace('\n', ''));
      fs.writeFileSync(
        path.resolve(currentDir, "info.json"),
        JSON.stringify(currentInfo, null, 4)
      );
    });
  };
  softpack.build(config);
} else {
  config.ignore.push("**/*.css");
  softpack.server(config);
}

function diffFilesinDir(dir, info) {
  var doDiff,
    doNotDiff = [
      "index.data.js",
      ".DS_Store",
      ".json",
      ".src.html",
      "index.html",
      ".scss",
      "assets.js"
    ];
  var files = fs.readdirSync(dir);
  files = files.filter(f => {
    if (!fs.statSync(path.resolve(dir, f)).isFile()) {
      diffFilesinDir(path.resolve(dir, f), info);
      return false; // do not dif directory
    }
    doDiff = true;
    doNotDiff.forEach(dnf => {
      if (f.endsWith(dnf)) {
        doDiff = false;
      } else if (f.startsWith("_")) {
        doDiff = false;
      }
    });
    return doDiff;
  });
  if(info.releaseHashes.lenght) {
    var diffDir = dir.replace(process.cwd(), path.resolve(process.cwd(), "dist"));
    files.forEach(f => {
      var diff = execSync(
        "git diff " + info.releaseHashes[0] + " HEAD " + path.resolve(dir, f)
      ).toString();
      if (diff) {
        fs.writeFileSync(path.resolve(diffDir, f) + ".diff", diff);
      }
    });
  }
}

function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return yyyy + "-" + mm + "-" + dd;
}
