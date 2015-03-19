var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');


function addDefaults(options) {
    var result = options || {};

    result.baseUrl = result.baseUrl || '/';
    result.baseApiPath = result.baseApiPath || result.baseUrl;
    result.scenarioTemplatePath = result.scenarioTemplatePath || path.join(__dirname, 'example', 'scenarioTemplate.js');

    return result;
}


module.exports = function (options) {
    options = addDefaults(options);


    var app = express(),
        servedDirectory = 'app';

    if ('production' === app.get('env')) {
        servedDirectory = 'dist';

        // prerender.io
        app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN).set('protocol', 'https'));
    } else {
        app.use(options.baseUrl + '/styles', express.static(path.join(__dirname, '.tmp', 'styles')));  // ugly hack to serve compiled SCSS; you will need to `grunt build` every time you change a style
    }

    servedDirectory = path.join(__dirname, servedDirectory);


    app.use(options.baseUrl, express.static(servedDirectory));
    app.use(options.baseUrl + '/scripts/template.js', express.static(options.scenarioTemplatePath));
    app.get(options.baseUrl + '/scripts/constants.js', function (req, res) {
        res.type('application/javascript')
           .send('angular.module("ludwigConstants", []).constant("config", ' +  // make options available to Angular's dependency management system
                 JSON.stringify(options) +
                 ');'
                );
    });
    app.use(favicon(path.join(servedDirectory, 'favicon.ico')));
    app.route(options.baseUrl + '/*').get(function (req, res) {
        res.sendFile(path.join(servedDirectory, 'index.html'));
    });

    return app;
};
