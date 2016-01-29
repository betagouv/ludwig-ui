'use strict';

angular.module('ludwig')
    .filter('formatDate', function() {
        return function(dateString) {
        	return moment(dateString).format('DD MMMM YYYY');
        }
    });
