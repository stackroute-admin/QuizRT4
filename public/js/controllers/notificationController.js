angular.module('quizRT')
  .controller('notificationController', function($scope, $routeParams, $http, $rootScope, $location) {
    $http.get('/notifications')
      .success(function(data, status, headers, config) {
        $scope.notificationData = data;
      });

      $scope.sendNotification = function(userChoice){
        if (userChoice==='accept'){
            //call updater to mark seen false
            //pass the meta object to the calling guy .
            //depends on req type


        }
        else if (userChoice==='reject') {
          //call updater to mark seen false
          //pass the meta object to the calling guy .
          //depends on req type
        }
        else{
          //keep quiet
        }
      }
  });
