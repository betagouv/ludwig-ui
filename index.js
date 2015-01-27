var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

module.exports = function(app) {
    var env = app.get('env');

    if ('development' === env) {
        // Disable caching of scripts for easier testing
        app.use(function noCache(req, res, next) {
            if (req.url.indexOf('/js/') === 0) {
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
            }
            next();
        });

        app.use(express.static(path.join(__dirname, '.tmp')));
        app.use(express.static(path.join(__dirname, 'app')));
    }

    if ('production' === env) {
        app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
        app.use(express.static(path.join(__dirname, 'dist')));
    }

    app.route('/*').get(function(req, res) {
        res.sendfile(__dirname + '/app/index.html');
    });
};
