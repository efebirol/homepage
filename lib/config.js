var path = require('path');
var hbs = require('./hbs');
var css = require('./css');
var fs = require('fs');

module.exports = {
  start: function (c) {
    if (c.BUILD) {
      console.log("starting build process")
    } else {
      console.log("starting server")
    }
  },
  end: function (c) {
    if (c.BUILD) {
      console.log("finished build process")
    } else {
      console.log("server ready")
    }
  },
  src: './',
  dist: 'dist',
  rootPath: process.cwd(),
  ignore: [
    'node_modules',
    'transpile_config',
    'dev',
    '.*',
    'lib',
    'dist_old',
    'private',
    'dist',
    'components/**/*.css',
    '*.sh',
    '*.json',
    'README.md',
    'TODO.md'
  ],
  socketCallbacks: {
    log: function (msg) {
      console.log(msg)
    }
  },
  log: {
    change: true,
    serve: true,
    add: true,
    delete: true,
  },
  actions: [
    {
      test: '**/*.hbs',
      init: [
        hbs.registerPartial
      ]
    },
    {
      test: '**/*.html',
      socketLoad: true,
      fileName: "[path]/[name].html",
      render: [
        hbs.render,
        function (c, o, spc) {
          if (!spc.BUILD) {
            c = c.replace('</head>', `
              <link rel="stylesheet" type="text/css" href="../../assets_dev/dev.css">
              <script src="../../assets_dev/dev.js" type="text/javascript"></script>
              </head>
            `)
          }
          return c
        }
      ]
    },
    {
      test: '**/!(_)*.scss',
      fileName: '[path]/[name].css',
      init: [
        function(context, o, c) {
          var renderedCss = css.render(context, o, c);
          renderedCss = css.prefix(renderedCss)
          fs.writeFileSync(o.fullPath.replace('.scss', '.css'), renderedCss)
        }
      ],
      render: [
        css.render,
        css.prefix
      ]
    }
  ]
}

console.log(process.cwd())