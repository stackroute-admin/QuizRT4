angular.module('quizRT')
  .controller('inviteFriendsController', function($scope,$rootScope,$http, $location) {
      console.log("Got new controller with Modal");
      $scope.onlineFriends = [];

      $scope.getOnlineFriends = function() {
        console.log("Trigger get online Friends");
        $rootScope.socket.emit('getOnlineFriends', $rootScope.loggedInUser);

      $rootScope.socket.on('onlineFriends', function( data) {
        console.log("Got Friends",data, "online", $scope.onlineFriends);
        /*var match = 0;
        $scope.onlineFriends.forEach(function(friend) {
            if (friend.id == data.id) {
                console.log("Got an match");
                match = 1;
            }
        });
        if (!match)
          $scope.onlineFriends.push(data); */
       $scope.onlineFriends = data;
       }); 

    };
    $scope.friends = "Hi Got ";

    $scope.reset = function() {
      console.log("reset friends list");
      $scope.onlineFriends = [];
      console.log($scope.onlineFriends);
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
    };
  });

