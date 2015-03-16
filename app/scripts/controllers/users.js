'use strict';

angular.module('ludwig').controller('UsersCtrl', function($scope, $http, $state, users, organizations, config) {
    $scope.users = users;
    $scope.organizations = organizations;
    $scope.newUser = {};
    $scope.currentUser = {};
    $scope.createUser = function() {
        $http.post(config.baseApiPath + '/users', $scope.newUser).finally(function() {
            $state.go($state.current, {}, {reload: true});
        });
    };
    $scope.updateUser = function() {
        $http.put(config.baseApiPath + '/users/' + $scope.currentUser._id, $scope.currentUser).finally(function() {
            $state.go($state.current, {}, {reload: true});
            $scope.currentUser = {};
        });
    };
    $scope.editUser = function(user) {
        $scope.currentUser = _.clone(user);
    };
    $scope.deleteUser = function(user) {
        $http.delete(config.baseApiPath + '/users/' + user._id).finally(function() {
            $state.go($state.current, {}, {reload: true});
        });
    };
});
