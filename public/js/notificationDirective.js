'use strict';
//  scope:{notificationCount:"="},
angular.module('quizRT')
  .directive('notificationData', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
    return {
      restrict: 'E',
      template: '<span class="btn notification-title glyphicon glyphicon-globe" ng-click="this.showNotifications()"><span class="notification-counter">{{notificationCount}}</span></span>',
      link: function postLink(scope, element, attrs) {
        var showNotifications = function() {
          $location.path('/notifications');
        }
        element.bind('click', function() {
          $location.path('/notifications');
        });
      }
    };
  }]);
