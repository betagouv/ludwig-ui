User interface for Ludwig, the collaborative testing tool
=========================================================

> L'interface graphique de l'outil de test collaboratif Ludwig.


[![Build Status](https://secure.travis-ci.org/sgmap/ludwig-ui.svg)](http://travis-ci.org/sgmap/ludwig-ui)
[![Dependency Status](https://david-dm.org/sgmap/ludwig-ui.svg)](https://david-dm.org/sgmap/ludwig-ui)
[![Dev Dependency status](https://david-dm.org/sgmap/ludwig-ui/dev-status.svg)](https://david-dm.org/sgmap/ludwig-ui#info=devDependencies&view=table)
[![Code Climate](https://codeclimate.com/github/sgmap/ludwig-ui/badges/gpa.svg)](https://codeclimate.com/github/sgmap/ludwig-ui)
[![Test Coverage](https://codeclimate.com/github/sgmap/ludwig-ui/badges/coverage.svg)](https://codeclimate.com/github/sgmap/ludwig-ui)


Usage
-----

### Build

Publishing this package through NPM will automatically build assets.

If you need to manually rebuild assets, run `npm run prepublish` (or `grunt build` if you have `grunt-cli` installed).

### Serve

The `ludwig-ui` package exposes a single function that takes a Configuration object (defined below) and returns an [Express](http://expressjs.com) app.

Once built, the content is best served with the following pattern to ensure frontend and backend routes match:

```javascript
app.use(config.baseUrl, require('ludwig-ui')(config));
```

Where `app` is an [Express](http://expressjs.com) app.


Configuration
-------------

### Create a configuration file

A Ludwig configuration object has to contain the items below.

> A good idea might be to store it in a JSON file and `require` that file.

The possible configuration values are:

- `scenarioTemplatePath`: path to the template that will be displayed for each test, as defined below. If relative, will be resolved against the file that sets up the server.
- `baseUrl`: route on which the tests UI will be served.
- `baseApiPath`: route on which the `ludwig-api` is served. Defaults to `baseUrl`.

### Test template

Create an Angular template to display each test's results:

```javascript
angular.module('ludwig').directive('scenario', function(config) {
    return {
        scope: { test: '=' },
        template: 'Test: {{ test.scenario | json }}'
    }
});
```

The `config` dependency can be used to obtain the server configuration object on the frontend.

Each test will be passed a `test` object containing the object that is stored in the database, as described in `ludwig-api`.
