angular.module('quizRT').controller('notificationController', function($scope, $rootScope, $routeParams) {
  // $scope.checkNotifications = function() {
  //   $rootScope.notificationSocket.emit('clientNotification', 'testuser');
  //
  // };
  $scope.$on('notificationEvent', function(event) {
    console.log('moron');
  });
  $scope.showDiv = function() {
      console.log('hi');
  };
  $rootScope.showDiv = function() {
    console.log('hi');
  }
});
