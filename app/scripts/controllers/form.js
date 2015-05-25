'use strict';

angular.module('ludwig').controller('FormCtrl', function($scope, $http, $state, $stateParams, possibleValues, droitsObtenus, test, keywords, config) {
    $scope.keywords = keywords;
    $scope.droitsChoices = _.sortBy(possibleValues, 'shortLabel');
    $scope.test = test;

    $scope.pageTitle = 'Modification du test' + (test.name ? ' « ' + test.name + ' »' : '');

    $scope.submitLabel = 'Enregistrer';
    $scope.test.expectedResults.forEach(function(droit) {
        droit.ref = _.find($scope.droitsChoices, { id: droit.code });
        droit.result = droitsObtenus[droit.code];
    });

    $scope.droitSelected = function(droit) {
        droit.result = droitsObtenus[droit.ref.id];
        droit.expectedValue = droit.result;
    };

    $scope.formatDroitValue = function(value) {
        if (_.isNumber(value)) {
            return '' + value + ' €';
        }
        return value ? 'Oui' : 'Non';
    };

    $scope.removeDroit = function(droit) {
        var index = $scope.test.expectedResults.indexOf(droit);
        $scope.test.expectedResults.splice(index, 1);
    };

    $scope.submit = function() {
        $scope.submitting = true;
        $scope.test.expectedResults.forEach(function(droit) {
            droit.code = droit.ref.id;
        });
        var test = _.pick($scope.test, ['_id', 'situation', 'name', 'description', 'expectedResults', 'keywords']);
        $http.put(config.baseApiPath + '/acceptance-tests/' + test._id, test).then(function() {
            $state.go('index.show', { 'testId': test._id });
        });
    };
});
