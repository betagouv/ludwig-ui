'use strict';

angular.module('ludwig').factory('UserService', function($http, $rootScope, config) {
    var user;

    return {
        user: function() {
            return user;
        },

        retrieveUserAsync: function() {
            return  this.getUserPromise().then(function(result) {
                user = result.data;
                $rootScope.$broadcast('userLoggedIn', user);
                return result.data;
            });
        },

        getUserPromise: function() {
            return $http.get(config.baseApiPath + '/profile');
        },

        login: function(email, password) {
            return $http.post(config.baseApiPath + '/login', {email: email, password: password}).then(function(result) {
                user = result.data;
                $rootScope.$broadcast('userLoggedIn', user);
                return result.data;
            });
        },

        logout: function() {
            return $http.post(config.baseApiPath + '/logout').then(function(result) {
                user = null;
                $rootScope.$broadcast('userLoggedOut');
                return result;
            });
        }
    };
});
