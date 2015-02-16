'use strict';

var hasType = function(activity) {
    return (!activity || !activity.type);
};

var getState = function(content) {
    switch (content.state) {
        case 'validated':
            return {label: 'Validation', icon: 'check'};
        case 'rejected':
            return {label: 'Rejet', icon: 'remove'};
        case 'pending':
            return {label: 'En attente', icon: 'clock-o'};
    }
};

var getActivityType = function(activity) {
    switch (activity.type) {
        case 'validation_update':
            var state = getState(activity.content);
            return state;
        case 'results_update':
            return {label: 'Nouveau résultat', icon: 'edit'}; // thumbs-up || thumbs-down
        case 'update':
            return {label: 'Modification', icon: 'edit'};
        case 'creation':
            return {label: 'Création', icon: 'plus'};
        case 'no-activity':
            return {label: 'Pas d\'activité enregistrée', icon: 'question'};
        default:
            return {label: 'Action inconnue', icon: 'question'};
    }
};

angular.module('ludwig')
    .filter('activityTypeLabelFilter', function() {
        return function(activity) {
            if (hasType(activity)) {
                return '';
            }

            var type = getActivityType(activity);
            return type.label;
        };
    })
    .filter('activityTypeIconFilter', function() {
        return function(activity) {
            if (hasType(activity)) {
                return '';
            }

            var type = getActivityType(activity);
            return type.icon;
        };
    })
    .filter('activityStatus', function($sce) {
        return function(status) {
            var res = '';
            switch (status) {
                case 'accepted-exact':
                case 'accepted-2pct':
                    res = '<span class="label label-success"><i class="fa fa-check"></i> Ok</span>';
                    break;
                case 'accepted-10pct':
                    res = '<span class="label label-warning"><i class="fa fa-check"></i> Near</span>';
                    break;
                case 'rejected':
                    res = '<span class="label label-danger"><i class="fa fa-check"></i> Ko</span>';
                    break;
            }
            return $sce.trustAsHtml(res);
        };
    });
