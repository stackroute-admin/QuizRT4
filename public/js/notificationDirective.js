'use strict';
//  scope:{notificationCount:"="},
angular.module('quizRT')
  .directive('notificationData', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
    return {
      restrict: 'E',
      template: '<span ng-click="postLink()" class="btn notification-title glyphicon glyphicon-globe"><span class="notification-counter">{{notificationCount}}</span></span>',
      link: function postLink(scope, element, attrs) {
        element.bind('click', function() {
          console.log('bind here');
          scope.$apply(function () {
             $location.path('/notifications');
          });
        });
      }
    };
  }]);
