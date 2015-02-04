'use strict';

angular.module('ludwig').factory('PossibleValuesService', function($http) {
    return {
        get: function() {
            return $http.get('/api/acceptance-tests/possibles-values');
        }
    };
});
