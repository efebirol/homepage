"use strict"
var fs = require('fs'),
    path = require('path'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    templateRenderer = require('./template'),
    transpile = require('./transpile');

var ioString = `
    <script src="/socket.io/socket.io.js"></script>
    <script>
    var socket = io();
    socket.on("reload", function() {
        location.reload();
    });
    </script>
`;

function startServer() {
    var servePath = process.env.rootDir,
        res_str;
    app.get('/*', function(req, res){
        if((req.originalUrl === '/') || (req.originalUrl.endsWith('.hbs')) || req.originalUrl.endsWith('.html')) {
            if(fs.existsSync(servePath + req.originalUrl)) {
                if(fs.lstatSync(servePath + req.originalUrl).isDirectory()) {
                    if(req.originalUrl.substr(req.originalUrl.length-1) === "/") {
                        if(fs.existsSync(servePath + req.originalUrl+"index.html")) {
                            res_str = templateRenderer(servePath + req.originalUrl+"index.html")
                        } else {
                            res_str = "File not found";
                        }
                    } else {
                        if(fs.existsSync(servePath + req.originalUrl+"index.html")) {
                            res_str = templateRenderer(servePath + req.originalUrl+"/index.html");
                        } else {
                            res_str = "File not found"
                        }
                    }
                } else {
                    if(fs.existsSync(servePath + req.originalUrl)) {
                        res_str = templateRenderer(servePath + req.originalUrl);
                    } else {
                        res_str = "File not found"
                    }
                }
                // res_str=res_str+ioString
            } else {
                console.log("file does not exis")
                res_str = 'file does not exis'
            }
            res.send(res_str)
        } else {
            // is asset
            res.sendFile(servePath + req.originalUrl);
        }
        console.log(servePath + req.originalUrl)
    });

    io.on('connection', function(socket){
      var clientIp = socket.request.connection.remoteAddress;
      console.log('a user connected ('+ clientIp +')');
      socket.on("log", console.log)
    });

    http.listen(process.env.port, process.env.host);
    return io;
}

module.exports = startServer