angular.module('quizRT')
  .controller('inviteFriendsController', function($scope,$rootScope,$http, $location) {
      console.log("Got new controller with Modal");
      $scope.onlineFriends = [];
      $scope.selectedFriends = [];
      $scope.minFriends = 3;
      $scope.showWarning = 0;

    $scope.getOnlineFriends = function() {
        console.log("Trigger get online Friends", $rootScope.loggedInUser);
        $rootScope.socket.emit('getOnlineFriends', $rootScope.loggedInUser);

    };

    $rootScope.socket.on('onlineFriends', function( data) {
      console.log("Got Friends",data, "online", $scope.onlineFriends);
      $scope.onlineFriends = data;
    });

    $scope.reset = function() {
      console.log("reset friends list");
      $scope.onlineFriends = [];
      $scope.selectedFriends = [];
      $scope.showWarning = 0;
    };

    $scope.Refresh= function() {
      $scope.reset();
      $scope.getOnlineFriends();
    };

    $scope.inviteFriends = function(topicId) {
      console.log("Invite Friends");

      if ($scope.selectedFriends.length < $scope.minFriends)
      {
          /*Show warning */
          $scope.showWarning = true;
      }
      else {
       $('.modal-backdrop').remove();
       $('body').removeClass('modal-open');
       $rootScope.playGame = {};
       $rootScope.playGame.topicId = topicId;
       $rootScope.playGame.topicName = $scope.topic.topicName;
       $rootScope.playGame.expiredUrl=true;
       $rootScope.isPlayingAGame = true; // to hide the footer-nav while playing a game
       $rootScope.firstUser=true;
       $scope.socket.emit('getUrl',$rootScope.loggedInUser);
     }
   };
     $scope.socket.once('catchUrl',function(data){
       if(data){
         $rootScope.playGame.url=data;

         $http.post( '/topicsHandler/topic/'+ $rootScope.playGame.topicId )
           .then( function( successResponse ) {
             $location.path( '/quizPlayer/'+$rootScope.playGame.topicName+'/'+$rootScope.playGame.topicId+'/'+$rootScope.playGame.url );
           }, function( errorResponse ) {
             console.log(errorResponse.data.error);
           });

         var url = '/quizPlayer/'+$rootScope.playGame.topicName+'/'+$rootScope.playGame.topicId+'/'+$rootScope.playGame.url;
         var obj = {'user': $rootScope.loggedInUser.userId, 'invitedFriendsList':$scope.selectedFriends, 'url':url};
         $rootScope.socket.emit("sendInvitedFriends", obj);
         $rootScope.notificationSocket.emit("sendInvitedFriends", obj);
       }
    });

    $scope.toggleSelectFriend = function(index) {
      var userId = $scope.onlineFriends[index].id;
      if($scope.selectedFriends.indexOf(userId) == -1){
          $scope.selectedFriends.push(userId);
          $scope.onlineFriends[index].selected = true;
      }
      else {
        $scope.selectedFriends.pop(userId);
        $scope.onlineFriends[index].selected = false;
      }
    };

});
