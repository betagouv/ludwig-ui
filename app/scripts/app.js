'use strict';

var app = angular.module('ludwig', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'ngStorage', 'ngSanitize', 'ludwigConstants']);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider, config) {
    moment.lang('fr');

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            abstract: true,
            controller: 'LayoutCtrl',
            url: '/?keyword?state?organization?status',
            templateUrl: 'views/layout.html',
            resolve: {
                keywords: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getKeywords();
                },
                states: function() {
                    return [
                        {id: 'validated', name: 'Valide'},
                        {id: 'pending', name: 'En attente'},
                        {id: 'rejected', name: 'Refusé'}
                    ];
                },
                activities: function() {
                    return [];
                }
            }
        })
        .state('index.list', {
            url: '?testId',
            controller: 'ListCtrl',
            templateUrl: 'views/list.html',
            anonymous: true,
            onEnter: function($stateParams, $state) {
                // redirection pour compatibilité avec param testId
                if ($stateParams.testId) {
                    $state.go('index.show', { testId: $stateParams.testId });
                }
            },
            resolve: {
                tests: function(AcceptanceTestsService, UserService, $stateParams) {
                    var filters = {
                        keyword: $stateParams.keyword,
                        organization: $stateParams.organization,
                        state: $stateParams.state,
                        status: $stateParams.status
                    };
                    return UserService.getUserPromise().then(function(result) {
                        // Don't use anonymous mode when the user is logged (to display test creators, etc.)
                        return AcceptanceTestsService.get(filters, false);
                    }).catch(function() {
                        return AcceptanceTestsService.get(filters, true);
                    });
                }
            }
        })
        .state('index.show', {
            url: ':testId/show',
            controller: 'ListCtrl',
            templateUrl: 'views/list.html',
            resolve: {
                tests: function(AcceptanceTestsService, $stateParams) {
                    return AcceptanceTestsService.getOne($stateParams.testId);
                }
            }
        })
        .state('login', {
            url: '/login?targetUrl',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            anonymous: true
        })
        .state('edit', {
            url: '/:testId/edit',
            templateUrl: 'views/form.html',
            controller: 'FormCtrl',
            resolve: {
                droitsObtenus: function($http, test, AcceptanceTestsService) {
                    return AcceptanceTestsService.simulate(test).then(function(result) {
                        return result.data;
                    });
                },
                test: function(AcceptanceTestsService, $stateParams) {
                    return AcceptanceTestsService.getOne($stateParams.testId).then(function(tests) {
                        var test = tests[0];
                        test.description = test.description || config.defaultDescription;
                        return test;
                    });
                },
                keywords: function(AcceptanceTestsService) {
                    return AcceptanceTestsService.getKeywords();
                },
                possibleValues: function(PossibleValuesService) {
                    return PossibleValuesService.get().then(function(result) {
                        return result.data;
                    });
                }
            }
        })
        .state('users', {
            url: '/users',
            templateUrl: 'views/users.html',
            controller: 'UsersCtrl',
            resolve: {
                users: ['$http', function($http) {
                    return $http.get(config.baseApiPath + '/users').then(function(result) {
                        return result.data;
                    });
                }],
                organizations : ['$http', function($http) {
                    return $http.get(config.baseApiPath + '/acceptance-tests/organizations').then(function(result) {
                        return result.data;
                    });
                }]
            }
        });
});

app.run(function($rootScope, $state, $stateParams, $window, UserService) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    UserService.retrieveUserAsync()
        .finally(function() {
            $rootScope.appReady = true;
        });

    $rootScope.$on('$stateChangeStart', function(e, state, params) {
        if (!UserService.user() && !state.anonymous) {
            $rootScope.returnToState = state;
            $rootScope.returnToStateParams = params;
            e.preventDefault();
            $state.go('login');
        }

    });
});
