'use strict';

angular.module('ludwig').controller('FormCtrl', function($scope, $http, $state, $stateParams, testableQuantities, droitsObtenus, test, keywords, config, AcceptanceTestsService) {
    $scope.keywords = keywords;
    $scope.testableQuantities = _.sortBy(testableQuantities, 'shortLabel');
    $scope.test = test;

    $scope.pageTitle = 'Modification du test' + (test.name ? ' « ' + test.name + ' »' : '');

    $scope.submitting = false;
    $scope.submitLabel = function() {
        return $scope.submitting ? 'Enregistrement…' : 'Enregistrer';
    };

    $scope.test.expectedResults.forEach(function(expectedResult) {
        expectedResult.ref = _.find($scope.testableQuantities, { id: expectedResult.code });
        expectedResult.result = droitsObtenus[expectedResult.code];
    });

    $scope.droitSelected = function(expectedResult) {
        expectedResult.code = expectedResult.refQuantity.id;
        expectedResult.result = droitsObtenus[expectedResult.code];
        expectedResult.expectedValue = expectedResult.result;
    };

    $scope.displayValue = AcceptanceTestsService.displayValue;

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
