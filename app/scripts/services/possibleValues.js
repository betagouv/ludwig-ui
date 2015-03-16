'use strict';

angular.module('ludwig').factory('PossibleValuesService', function($http, config) {
    return {
        get: function() {
            return $http.get(config.baseApiPath + '/acceptance-tests/possibles-values');
        }
    };
});
