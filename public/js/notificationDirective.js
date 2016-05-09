'use strict';
//  scope:{notificationCount:"="},
angular.module('quizRT')
  .directive('notificationData', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
    return {
      restrict: 'E',
      template: '<a ng-click="showNotifications()">{{notificationCount}}</a>',
      link: function postLink(scope, element, attrs) {

        $rootScope.$on('sent:a:frndreq', function(event, data) {
          scope.notificationCount += 1;
        });

        //Do it While Getting User Data
        // $http.get('/notifications')
        //   .success(function(data, status, headers, config) {
        //     scope.notificationCount = data.length;
        //     scope.$root.notificationCount = data.length;
        //     scope.notificationData = data;
        //   });


        var showNotifications = function() {
          $location.path('/notifications');
        }
        element.bind('click', function() {
          $location.path('/notifications');
        });
      }
    };
  }]);
