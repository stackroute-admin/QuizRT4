angular.module('quizRT')
  .controller('notificationController', function($scope, $routeParams, $http, $rootScope, $location) {

   console.log("Get Notifications");
   $rootScope.notificationSocket.emit("getMyNotifications", $rootScope.loggedInUser.userId);

   /*Listen For Notifications */
   $rootScope.notificationSocket.on('NotificationList', function(data) {
      console.log("got some notifications", data);
      $scope.notificationData = data;
      $rootScope.notificationCount = data.length;
   });

   /*Listen for new notificatons */
   $rootScope.notificationSocket.on('NewNotification' , function(data) {
       console.log("Got new Notification", data);
       /*Get Complete Data */
       $rootScope.notificationSocket.emit('getMyNotifications', $rootScope.loggedInUser.userId);
   });

   $scope.sendNotification = function(userEvent, notificationData) {
      notificationData.event = userEvent;
      notificationData.myId = $rootScope.loggedInUser.userId;
      $rootScope.notificationSocket.emit('response', notificationData);
      $rootScope.notificationCount -= 1;
   };

   $rootScope.notificationSocket.on('playGame', function(data) {
      console.log(data);
      $location.path(data.url);
   });

  });
