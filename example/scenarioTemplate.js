angular.module('ludwig').directive('scenario', function() {
    return {
        scope: { test: '=' },
        template: '<pre>{{ test.scenario }}</pre>'
    }
});
