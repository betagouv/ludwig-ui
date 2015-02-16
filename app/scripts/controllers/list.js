'use strict';

angular.module('ludwig').controller('ListCtrl', function($scope, $modal, $window, $state, $stateParams, $http, config, AcceptanceTestsService, acceptanceTests) {
    $scope.tests = acceptanceTests;
    $scope.launch = AcceptanceTestsService.launchTest;
    $scope.showUrls = config.showUrls;

    $scope.validTestsNb = _.where(acceptanceTests, { currentStatus: 'accepted-exact' }).length;
    $scope.validTestsNb += _.where(acceptanceTests, { currentStatus: 'accepted-2pct' }).length;
    $scope.warningTestsNb = _.where(acceptanceTests, { currentStatus: 'accepted-10pct' }).length;
    $scope.errorTestsNb = _.where(acceptanceTests, { currentStatus: 'rejected' }).length;

    if ($scope.tests.length === 1) {
        $scope.tests[0].open = true;
    }

    $scope.$emit('stopWaiting');

    $scope.toggleTimeline = function(test) {
        if (!test.timeline) {
            $scope.getTimeline(test);
        }
    };

    $scope.getTimeline = function(test) {
        $http.get('/api/acceptance-tests/' + test._id + '/timeline').then(function(result) {
            if (result.data.length === 0) {
                result.data.push({
                    type: 'no-activity'
                });
            }
            test.timeline = result.data;
        });
    };

    $scope.gotoDebugOpenFisca = function(situation) {
        $http.get('/api/situations/' + situation + '/openfisca-request').then(function(result) {
            var url = 'http://www.openfisca.fr/outils/trace?api_url=http://localhost:2000&situation=';
            url += encodeURIComponent(JSON.stringify(result.data));
            window.location.href = url;
        });
    };

    $scope.validateTest = function(test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation', {
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
            $http.put('/api/acceptance-tests/' + test._id + '/validation', {
                state: 'rejected',
                rejectionMessage: comment
            }).then(function() {
                test.state = 'rejected';
                $scope.getTimeline(test);
            });
        });
    };

    $scope.setPendingTest = function(test) {
        $http.put('/api/acceptance-tests/' + test._id + '/validation', {
            state: 'pending'
        }).then(function() {
            test.state = 'pending';
            $scope.getTimeline(test);
        });
    };

    $scope.deleteTest = function(test) {
        if ($window.confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) {
            $http.delete('/api/acceptance-tests/' + test._id).then(function() {
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
