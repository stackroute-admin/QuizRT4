angular.module('quizRT')
  .controller('notificationController', function($scope, $routeParams, $http, $rootScope, $location) {
    $http.get('/notifications')
      .success(function(data, status, headers, config) {
        $scope.notificationData = data;
      });

    $scope.sendNotification = function(userEvent, notification) {

      $http.get('/notifications/updateStatus/' + notification).success(function(response) {
          $http.get('/notifications/')
            .success(function(data, status, headers, config) {
              $scope.notificationData = data;
              $rootScope.notificationSocket.emit('respond:to:frndreq', notification);
            });
          })
        }
      });
