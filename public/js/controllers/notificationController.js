angular.module('quizRT')
  .controller('notificationController', function($scope, $routeParams, $http, $rootScope, $location) {

   console.log("Get Notifications");
   $rootScope.notificationSocket.emit("getMyNotifications", $rootScope.loggedInUser);

   /*Listen For Notifications */
   $rootScope.notificationSocket.on('NotificationList', function(data) { 
      console.log("got some notifications", data);
      $scope.notificationData = data; 
   });

   $scope.sendNotification = function(userEvent, notificationData) {
      notificationData.event = userEvent;
      console.log("Sending data", notificationData);
      $rootScope.notificationSocket.emit('response', notificationData);
   };

  });
