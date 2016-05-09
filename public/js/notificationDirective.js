'use strict';
//  scope:{notificationCount:"="},
angular.module('quizRT')
  .directive('notificationData', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
    return {
      restrict: 'E',
      template: '<a ng-click="showNotifications()" ng-bind="notificationCount">{{notificationCount}}</a>',
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
