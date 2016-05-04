angular.module('quizRT')
  .controller('notificationController', function($scope, $routeParams, $http, $rootScope, $location) {
    $http.get('/notifications')
      .success(function(data, status, headers, config) {
        $scope.notificationData = data;
      });

    $scope.sendNotification = function(userEvent, notification) {
      //trigger event that is subscribed by the clients.
      //submit user actions
      console.log(notification);
      $http.get('/notifications/updateStatus/'+notification).success(function(response) {
          console.log(response);
        })
        // $http.post("/notifications/updateStatus", "abcdefk").success(function(response) {
        //   console.log(response);
        // });
    }

  });
