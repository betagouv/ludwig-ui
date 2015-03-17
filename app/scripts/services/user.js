'use strict';

angular.module('ludwig').factory('UserService', function($http, $rootScope, LudwigConfig) {
    var user;

    return {
        user: function() {
            return user;
        },

        retrieveUserAsync: function() {
            return $http.get(LudwigConfig.baseApiPath + '/profile').then(function(result) {
                user = result.data;
                $rootScope.$broadcast('userLoggedIn', user);
                return result.data;
            });
        },

        login: function(email, password) {
            return $http.post(LudwigConfig.baseApiPath + '/login', {email: email, password: password}).then(function(result) {
                user = result.data;
                $rootScope.$broadcast('userLoggedIn', user);
                return result.data;
            });
        },

        logout: function() {
            return $http.post(LudwigConfig.baseApiPath + '/logout').then(function(result) {
                user = null;
                $rootScope.$broadcast('userLoggedOut');
                return result;
            });
        }
    };
});
