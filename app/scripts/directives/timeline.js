'use strict';

angular.module('acceptanceTests').directive('activityTimeline', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/timeline.html',
        scope: {
            activities: '=',
            showTarget: '='
        },
        controller: function($scope) {
            $scope.getDate = function(activity) {
                return moment(activity.date).fromNow();
            };
        }
    };
});
