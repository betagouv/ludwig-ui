'use strict';

angular.module('ludwig').factory('TestableQuantitiesService', function($http, config) {
    return {
        get: function() {
            return $http.get(config.baseApiPath + '/acceptance-tests/testable-quantities');
        }
    };
});
