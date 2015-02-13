'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

module.exports = function(app, baseDir, config) {
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

        app.use(config.baseUrl, express.static(path.join(__dirname, '.tmp')));
        app.use(config.baseUrl, express.static(path.join(__dirname, 'app')));
    }

    if ('production' === env) {
        app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
        app.use(config.baseUrl, express.static(path.join(__dirname, 'dist')));
    }

    app.use(config.baseUrl+ '/scripts/template.js', express.static(path.join(baseDir, config.scenarioTemplate)));
    app.use(config.baseUrl+ '/scripts/constants.js', express.static(path.join(baseDir, config.constants)));

    app.get(config.baseUrl + '/scripts/server-config.js', function (req, res) {
        res.type('application/javascript').send('window.serverConfig = ' + JSON.stringify(config.serverConfig || {}) + ';');
    });


    app.route(config.baseUrl + '/*').get(function(req, res) {
        res.sendfile(path.join(__dirname, 'app/index.html'));
    });
};
