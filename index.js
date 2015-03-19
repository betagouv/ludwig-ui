var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');


module.exports = function (config) {
    config.baseApiPath = config.baseApiPath || config.baseUrl;


    var app = express(),
        servedDirectory = 'app';

    if ('production' === app.get('env')) {
        servedDirectory = 'dist';

        // prerender.io
        app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN).set('protocol', 'https'));
    } else {
        app.use(config.baseUrl + '/styles', express.static(path.join(__dirname, '.tmp', 'styles')));  // ugly hack to serve compiled SCSS; you will need to `grunt build` every time you change a style
    }

    servedDirectory = path.join(__dirname, servedDirectory);


    app.use(config.baseUrl, express.static(servedDirectory));
    app.use(config.baseUrl + '/scripts/template.js', express.static(config.scenarioTemplatePath));
    app.get(config.baseUrl + '/scripts/constants.js', function (req, res) {
        res.type('application/javascript')
           .send('angular.module("ludwigConstants", []).constant("config", ' +  // make config available to Angular's dependency management system
                 JSON.stringify(config) +
                 ');'
                );
    });
    app.use(favicon(path.join(servedDirectory, 'favicon.ico')));
    app.route(config.baseUrl + '/*').get(function (req, res) {
        res.sendFile(path.join(servedDirectory, 'index.html'));
    });

    return app;
};
