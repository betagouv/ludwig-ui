'use strict';


angular.module('LudwigConfig', []).constant('LudwigConfig', function () {
    return {
        $get: function () {
            return {
                scenarioTemplate: 'ui/paie.js',
                baseUrl: '/tests',
                baseApiPath: '/tests/api',
                showUrls: true
           };
        }
    };
});
