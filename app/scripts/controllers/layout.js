'use strict';

angular.module('ludwig').controller('LayoutCtrl', function($scope, $state, $stateParams, $timeout, AcceptanceTestsService, UserService, keywords, states, activities) {
    $scope.activities = activities;
    $scope.keywords = keywords;

    if ($stateParams.keyword) {
        if (_.isArray($stateParams.keyword)) {
            $scope.selectedKeywords = $stateParams.keyword;
        } else {
            $scope.selectedKeywords = [$stateParams.keyword];
        }
    } else {
        $scope.selectedKeywords = [];
    }

    var toFilterObj = function(filterArray) {
        var filterObj = {};
        if (!_.isArray(filterArray)) {
            filterObj[filterArray] = true;
        } else {
            _.forEach(filterArray, function(filter) {
                filterObj[filter] = true;
            });
        }
        return filterObj;
    };

    $scope.states = states;
    $scope.selectedStates = ($stateParams.state) ? toFilterObj($stateParams.state) : {};

    $scope.user = UserService.user();

    var extractSelectedFilters = function(selection) {
        return _.chain(selection).keys().filter(function(current) {
            return selection[current];
        }).value();
    };

    $scope.validate = function() {
        var filters = {};

        filters.keyword = $scope.selectedKeywords;

        var extractedState = extractSelectedFilters($scope.selectedStates);
        if (extractedState.length > 0) {
            filters.state = extractedState;
        }

        $state.go('index.list', filters, { reload: true });
    };

    $scope.active = function(route) {
        return $state.is(route);
    };
});

