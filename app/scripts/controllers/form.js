'use strict';

angular.module('ludwig').controller('FormCtrl', function($scope, $http, $state, $stateParams, possibleValues, droitsObtenus, test, keywords, config, AcceptanceTestsService) {
    $scope.keywords = keywords;
    $scope.possibleValues = _.sortBy(possibleValues, 'shortLabel');
    $scope.test = test;

    $scope.pageTitle = 'Modification du test' + (test.name ? ' « ' + test.name + ' »' : '');

    $scope.submitting = false;
    $scope.submitLabel = function() {
        return $scope.submitting ? 'Enregistrement…' : 'Enregistrer';
    };

    $scope.showComputableInput = $scope.test.expectedResults.map(function(expectedResult) {
        return ! isUncomputabilityReason(expectedResult.expectedValue);
    });

    $scope.test.expectedResults.forEach(function(expectedResult) {
        expectedResult.result = droitsObtenus[expectedResult.code];
    });

    $scope.droitSelected = function(expectedResult) {
        expectedResult.code = expectedResult.ref.id;
        expectedResult.result = droitsObtenus[expectedResult.code];
        expectedResult.expectedValue = expectedResult.result;
    };

    $scope.displayValueFor = AcceptanceTestsService.displayValueFor;

    function isUncomputabilityReason(value) {
        return _.isString(value);
    }
    $scope.isUncomputabilityReason = isUncomputabilityReason;

    $scope.removeDroit = function(droit) {
        var index = $scope.test.expectedResults.indexOf(droit);
        $scope.test.expectedResults.splice(index, 1);
    };

    $scope.submit = function() {
        $scope.submitting = true;
        var test = _.pick($scope.test, ['_id', 'situation', 'name', 'description', 'expectedResults', 'keywords']);
        $http.put(config.baseApiPath + '/acceptance-tests/' + test._id, test).then(function() {
            AcceptanceTestsService.launchTest(test)
            .finally(function () {
                    $state.go('index.show', { 'testId': test._id });
                });
        });
    };
});
