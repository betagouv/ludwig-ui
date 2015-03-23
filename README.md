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

Installing this package through NPM (example: adding it as dependency) will automatically build assets.

Your admin password will be required to install Ruby dependencies.

If you need to manually rebuild assets because you changed them, execute `npm run postinstall`.

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

- `scenarioTemplatePath`: **absolute** path to the template that will be displayed for each test, as defined below.
- `baseUrl`: route at which the tests UI will be served.
- `baseApiPath`: route at which the `ludwig-api` is served. Defaults to `baseUrl`.

### Test template

Create an Angular template to display each test's results:

```javascript
angular.module('ludwig').directive('scenario', function() {
    return {
        scope: { test: '=' },
        template: 'Test: {{ test.scenario | json }}'
    }
});
```

Each test will be passed a `test` object containing the object that is stored in the database, as described in `ludwig-api`.
