var path = require('path');

var express = require('express');
var favicon = require('serve-favicon');


module.exports = function(app, baseDir, config) {
    var servedDirectory = 'app';

    if ('production' === app.get('env')) {
        // prerender.io
        app.use(require('prerender-node').set('prerenderToken', process.env.PRERENDER_TOKEN).set('protocol', 'https'));

        servedDirectory = 'dist';
    } else {
        app.use(config.baseUrl + '/styles', express.static(path.join(__dirname, '.tmp', 'styles')));  // ugly hack to serve compiled SCSS; you will need to `grunt build` every time you change a style
    }

    app.use(config.baseUrl, express.static(path.join(__dirname, servedDirectory)));

    app.use(favicon(path.join(__dirname, servedDirectory, 'favicon.ico')));

    app.use(config.baseUrl + '/scripts/template.js', express.static(path.join(baseDir, config.scenarioTemplate)));
    app.use(config.baseUrl + '/scripts/constants.js', express.static(path.join(baseDir, config.constants)));

    app.get(config.baseUrl + '/scripts/server-config.js', function (req, res) {
        res.type('application/javascript').send('window.serverConfig = ' + JSON.stringify(config.serverConfig || {}) + ';');
    });

    app.route(config.baseUrl + '/*').get(function(req, res) {
        res.sendFile(path.join(__dirname, servedDirectory, 'index.html'));
    });
}
