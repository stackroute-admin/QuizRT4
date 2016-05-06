angular.module('quizRT')
  .controller('inviteFriendsController', function($scope,$rootScope,$http, $location) {
      console.log("Got new controller with Modal");
      $scope.onlineFriends = [];
      $scope.selectedFriends = [];
      $scope.maxFriends = 3;

    $scope.getOnlineFriends = function() {
        console.log("Trigger get online Friends", $rootScope.loggedInUser);
        $rootScope.socket.emit('getOnlineFriends', $rootScope.loggedInUser);

         $rootScope.socket.on('onlineFriends', function( data) {
           console.log("Got Friends",data, "online", $scope.onlineFriends);
           $scope.onlineFriends = data;
        });
    };

    $scope.reset = function() {
      console.log("reset friends list");
      $scope.onlineFriends = [];
      $scope.selectedFriends = [];
      console.log($scope.onlineFriends);
    };

    $scope.Refresh= function() {
      $scope.reset();
      $scope.getOnlineFriends();
    };

    $scope.inviteFriends = function(topicId) {
      console.log("Invite Friends");
       $rootScope.playGame = {};
       $rootScope.playGame.topicId = topicId;
       $rootScope.isPlayingAGame = true; // to hide the footer-nav while playing a game
       $http.post( '/topicsHandler/topic/'+ topicId )
         .then( function( successResponse ) {
           $location.path( '/quizPlayer' );
         }, function( errorResponse ) {
           console.log(errorResponse.data.error);
         });

    };

    $scope.toggleSelectFriend = function(index) {
      console.log("Selected id", $scope.onlineFriends[index]);
      var userId = $scope.onlineFriends[index].id;
      if($scope.selectedFriends.indexOf(userId) == -1){
        if ($scope.selectedFriends.length < $scope.maxFriends) {
          $scope.selectedFriends.push(userId);
          $scope.onlineFriends[index].selected = true;
        }
      }
      else {
        $scope.selectedFriends.pop(userId);
        $scope.onlineFriends[index].selected = false;
      }
      console.log($scope.selectedFriends);
    };

});
