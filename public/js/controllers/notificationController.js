angular.module('quizRT')
  .controller('notificationController', function($scope, $routeParams, $http, $rootScope, $location) {

    // $rootScope.notificationSocket.on('updateCounter', function(data) {
    //   console.log(data);
    // });
    console.log($rootScope.notificationSocket);
    $http.get('/notifications')
      .success(function(data, status, headers, config) {
        $scope.notificationData = data;
      });

    $scope.sendNotification = function(notification) {
      //trigger event that is subscribed by the clients.
      $rootScope.notificationSocket.emit('respond:to:frndreq', notification);

      //submit user actions

      $http.get('/notifications/updateStatus/' + notification).success(function(response) {
          console.log(notification);
          $http.get('/notifications')
            .success(function(data, status, headers, config) {
              $scope.notificationData = data;
            });
        })
        // $http.post("/notifications/updateStatus", "abcdefk").success(function(response) {
        //   console.log(response);
        // });
    }

  });
