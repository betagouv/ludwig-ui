'use strict';

angular.module('ludwig').factory('PossibleValuesService', function($http, LudwigConfig) {
    return {
        get: function() {
            return $http.get(LudwigConfig.baseApiPath + '/acceptance-tests/possibles-values');
        }
    };
});
