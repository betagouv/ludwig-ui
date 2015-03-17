'use strict';

angular.module('ludwig').controller('ListCtrl', function($scope, $timeout, $q, $modal, $window, $state, $stateParams, $http, LudwigConfig, tests, AcceptanceTestsService) {
    $scope.launch = AcceptanceTestsService.launchTest;
    $scope.showUrls = config.showUrls && !$scope.readOnly;

    // récupération des tests par blocs pour ne pas bloquer l'ui au chargement
    var appendTests = function(index) {
        return function() {
            $scope.tests = $scope.tests.concat(tests.slice(index, index + 30));
        };
    };

    $scope.tests = [];
    $scope.ready = false;
    var promises = [];
    for (var i = 0; i < tests.length; i = i + 30) {
        promises.push($timeout(appendTests(i)));
    }
    $q.all(promises).then(function() {
        if ($scope.tests.length === 1) {
            $scope.tests[0].open = true;
            $scope.toggleTimeline($scope.tests[0]);
        }
        $scope.validTestsNb = _.where(tests, { currentStatus: 'accepted-exact' }).length;
        $scope.validTestsNb += _.where(tests, { currentStatus: 'accepted-2pct' }).length;
        $scope.warningTestsNb = _.where(tests, { currentStatus: 'accepted-10pct' }).length;
        $scope.errorTestsNb = _.where(tests, { currentStatus: 'rejected' }).length;
        $scope.ready = true;
    });

    $scope.getTimeline = function(test) {
        $http.get(LudwigConfig.baseApiPath + '/acceptance-tests/' + test._id + '/timeline').then(function(result) {
            if (result.data.length === 0) {
                result.data.push({
                    type: 'no-activity'
                });
            }
            test.timeline = result.data;
        });
    };

    $scope.toggleTimeline = function(test) {
        if (!test.timeline && !$scope.readOnly) {
            $scope.getTimeline(test);
        }
    };

    $scope.gotoDebugOpenFisca = function(situation) {
        $http.get(LudwigConfig.baseApiPath + '/situations/' + situation + '/openfisca-request').then(function(result) {
            var url = 'http://www.openfisca.fr/outils/trace?api_url=http://localhost:2000&situation=';
            url += encodeURIComponent(JSON.stringify(result.data));
            window.location.href = url;
        });
    };

    $scope.validateTest = function(test) {
        $http.put(LudwigConfig.baseApiPath + '/acceptance-tests/' + test._id + '/validation', {
            state: 'validated'
        }).then(function() {
            test.state = 'validated';
            $scope.getTimeline(test);
        });
    };

    $scope.rejectTest = function(test) {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal.html',
            resolve: {
                comment: function() {
                    return test.comment;
                }
            },
            controller: function($scope, $modalInstance, comment) {
              $scope.comment = comment;

              $scope.ok = function (comment) {
                $modalInstance.close(comment);
              };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };
            }
        });

        modalInstance.result.then(function(comment) {
            $http.put(LudwigConfig.baseApiPath + '/acceptance-tests/' + test._id + '/validation', {
                state: 'rejected',
                rejectionMessage: comment
            }).then(function() {
                test.state = 'rejected';
                $scope.getTimeline(test);
            });
        });
    };

    $scope.setPendingTest = function(test) {
        $http.put(LudwigConfig.baseApiPath + '/acceptance-tests/' + test._id + '/validation', {
            state: 'pending'
        }).then(function() {
            test.state = 'pending';
            $scope.getTimeline(test);
        });
    };

    $scope.deleteTest = function(test) {
        if ($window.confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
            $http.delete(LudwigConfig.baseApiPath + '/acceptance-tests/' + test._id).then(function() {
                $state.go($state.current, {}, {
                    reload: true
                });
            });
        }
    };

    $scope.launchAll = function() {
        $scope.pendingTests = $scope.tests.length;
        $scope.tests.forEach(function(test) {
            $scope.launch(test)
                .finally(function() {
                    $scope.pendingTests--;
                });
        });
    };
});
