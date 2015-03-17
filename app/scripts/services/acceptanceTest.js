'use strict';

angular.module('ludwig').factory('AcceptanceTestsService', function($q, $http, $filter, PossibleValuesService, LudwigConfig) {
    var droits = {};

    PossibleValuesService.get().then(function(result) {
        droits = _.indexBy(result.data, 'id');
    });

    var statusMapping = {
        'accepted-exact': 'ok',
        'accepted-2pct': 'ok',
        'accepted-10pct': 'near',
        'rejected': 'ko'
    };

    var handleResult = function(result, test, deferred) {
        test.lastExecution = angular.copy(result.data);
        test.currentStatus = test.lastExecution.status;

        formatValues(test);

        if (deferred) {
            if (test.status === 'ko') {
                deferred.reject();
            } else {
                deferred.resolve();
            }
        }
    };

    var displayValue = function(value) {
        if (_.isBoolean(value)) {
            return value ? 'Oui' : 'Non';
        }

        if (_.isNumber(value)) {
            return '' + value + ' €';
        }

        return '';
    };

    var htmlDescription = function(text) {
        if (!text) {
            return '';
        }

        var result = $filter('linky')(text);
        result = result.replace(/&#10;/g, '<br>');

        return result;
    };

    var formatValues = function(test) {
        if (test._updated) {
            var updatedAt = moment(test._updated);
            test.updatedAt = updatedAt.format('DD/MM/YYYY à HH:mm');
        }
        if (test._created) {
            var createdAt = moment(test._created);
            test.createdAt = createdAt.format('DD/MM/YYYY à HH:mm');
        }

        test.status = statusMapping[test.currentStatus];
        test.htmlDescription = htmlDescription(test.description);

        if (test.lastExecution) {
            test.expectedResults = test.lastExecution.results;
        }

        test.expectedResults.forEach(function (expectedResult) {
            expectedResult.displayLabel = droits[expectedResult.code].shortLabel;
            expectedResult.displayStatus = expectedResult.status ? statusMapping[expectedResult.status] : 'unknown';
            expectedResult.displayExpected = displayValue(expectedResult.expectedValue);
            expectedResult.displayResult = displayValue(expectedResult.result);
        });
    };

    var orderTestsByKeywords = function(tests) {
        return _.sortBy(tests, function(test) {
            return test.keywords.join() + test.name;
        });
    };

    return {
        getKeywords: function() {
            return $http.get(LudwigConfig.baseApiPath + '/acceptance-tests/keywords').then(function(result) {
                return result.data;
            });
        },

        getOne: function(id) {
            return $http.get(LudwigConfig.baseApiPath + '/acceptance-tests/' + id).then(function(result) {
                var tests = [result.data];
                _.map(tests, formatValues);
                return tests;
            });
        },

        get: function(filters, isPublic) {
            return $http.get(LudwigConfig.baseApiPath + (isPublic ? '/public' : '') + '/acceptance-tests', { params: filters }).then(function(result) {
                var tests = result.data;
                _.map(tests, formatValues);
                return orderTestsByKeywords(tests);
            });
        },

        simulate: function(test) {
            return $http.post(LudwigConfig.baseApiPath + '/acceptance-tests/' + test._id + '/simulation');
        },

        launchTest: function(test) {
            test.running = true;
            delete test.status;
            test.expectedResults.forEach(function(expectedResult) {
                delete expectedResult.status;
                delete expectedResult.result;
            });

            var deferred = $q.defer();

            var promise = $http.post(LudwigConfig.baseApiPath + '/acceptance-tests/' + test._id + '/executions', {});
            promise.then(function(result) {
                return handleResult(result, test, deferred);
            }, function() {
                test.status = 'ko';
                test.expectedResults.forEach(function(droit) {
                    droit.status = 'ko';
                });
                deferred.reject();
            });

            deferred.promise.finally(function() {
                test.running = false;
            });

            return deferred.promise;
        }
    };
});
