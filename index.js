var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');

var angular = require('./lib/angular-express-helpers.js');


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
        servedDirectory = path.join(__dirname, 'dist');

    app.use('/', express.static(servedDirectory));
    app.use('/scripts/template.js', express.static(options.scenarioTemplatePath));
    app.get('/scripts/constants.js', angular.sendConfig(options, 'ludwigConstants'));
    app.use(favicon(path.join(servedDirectory, 'favicon.ico')));
    app.route('/*').get(function (req, res) {
        res.sendFile(path.join(servedDirectory, 'index.html'));
    });

    return app;
};
