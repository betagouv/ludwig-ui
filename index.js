'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');

module.exports = function(app, baseDir, config) {
    var env = app.get('env');
    var servedDirectory = 'app';

    if ('development' === env) {
        app.use(config.baseUrl, express.static(path.join(__dirname, '.tmp')));
    }

    if ('production' === env) {
        // prerender.io
        app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN).set('protocol', 'https'));

        servedDirectory = 'dist';
        app.use(favicon(path.join(__dirname, 'dist', 'favicon.ico')));
    }

    app.use(config.baseUrl, express.static(path.join(__dirname, servedDirectory)));
    app.use(config.baseUrl + '/scripts/template.js', express.static(path.join(baseDir, config.scenarioTemplate)));
    app.use(config.baseUrl + '/scripts/constants.js', express.static(path.join(baseDir, config.constants)));

    app.get(config.baseUrl + '/scripts/server-config.js', function (req, res) {
        res.type('application/javascript').send('window.serverConfig = ' + JSON.stringify(config.serverConfig || {}) + ';');
    });

    app.route(config.baseUrl + '/*').get(function(req, res) {
        res.sendFile(path.join(__dirname, servedDirectory, 'index.html'));
    });
};
