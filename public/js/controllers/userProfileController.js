//Copyright {2016} {NIIT Limited, Wipro Limited}
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//
//   Name of Developers  Raghav Goel, Kshitij Jain, Lakshay Bansal, Ayush Jain, Saurabh Gupta, Akshay Meher
//                        + Anil Sawant

angular.module('quizRT')
.controller('userProfileController', function($http, $scope, $rootScope, $location) {

  // redirect to login page if the user's isAuthenticated cookie doesn't exist
  if (!$rootScope.isAuthenticatedCookie) {
    $rootScope.logInLogOutErrorMsg = 'You are logged out. Kindly Login...';
    $rootScope.logInLogOutSuccessMsg = '';
    $location.path('/login');
  } else {
    $rootScope.hideFooterNav = false;
    $rootScope.stylesheetName = "userProfile";
    $scope.a = 7;
    $scope.see = true;
    $scope.btnImg = "images/userProfileImages/seeall.jpg";
    $scope.recentGameResults = [];
    for (game in $rootScope.recentGames) {
      $scope.recentGameResults.push($rootScope.recentGames[game]);
    }
    $scope.showTournamentDetails = function(tournamentId) {
      $location.path('/tournament/' + tournamentId);
    };
    //added for test
    $scope.createTournament = function() {
      $location.path('/tournamentHandler/createTournament');
    };
    //end
    $scope.seeHide = function(length) {
      if ($scope.see) {
        $scope.see = false;
        $scope.btnImg = "images/userProfileImages/hide.jpg";
        $scope.a = length;
      } else {
        $scope.see = true;
        $scope.btnImg = "images/userProfileImages/seeall.jpg";
        $scope.a = 7;
      }
    }
    $scope.showRecentResult = function(gameId) {
      $rootScope.isComingFromTournament = false;
      $rootScope.showRecentResult = true;
      $location.path('/quizResult/' + gameId);
    }

    //test
      $scope.topicsList = function(data){
             $http({
                method : 'GET',
                url : '/userProfile/topicsList',
                params : {topic:data}
              }) .then(
                function(successResponse) {
                  $scope.topicsData = successResponse.data;
                },
                function(errorResponse) {
                  console.log('Error in fetching data.');
                  console.log(errorResponse.status);
                  console.log(errorResponse.statusText);
                }
              )
            }



               $scope.searchPeople1 = function(){
                 var inputData;
                   $scope.getVal=function(changedVal){
                   $scope.radioVal=changedVal;
                   console.log('radio'+ $scope.radioVal);
                 }
                   console.log('radio'+ $scope.radioVal);
                   $scope.showOne = function (){
                       $scope.one = true;
                       $scope.three = false;
                       $scope.four = false;
                     }

                     $scope.showThree = function (){
                       $scope.one = false;
                      //  $scope.two = false; // now show this one
                       $scope.three = true;
                       $scope.four = false;
                     }
                     $scope.showFour = function (){
                       $scope.one = false;
                      //  $scope.two = false; // now show this one
                       $scope.three = false;
                        $scope.four = true;
                     }

                   $scope.clearSearch = function(){
                     $scope.user = null;
                     $scope.topicData = null;
                     $scope.topicsData = null;
                      $scope.searchPeople = null;
                   }
                     $scope.selectedTopic=function(value){
                       $scope.topicVal = value;
                       console.log("inside function:"+  $scope.topicVal);
                     }

                     $scope.userData = function (user) {
                     inputData = {name:user,radio:$scope.radioVal,selectTopic:$scope.topicVal};
                      $http({
                         method : 'GET',
                         url : '/userProfile/searchPeople',
                         params : inputData
                       }) .then(
                         function(successResponse) {
                           $scope.searchPeople = successResponse.data;
                           $scope.topicSortList = [];
                                 if ($scope.topicVal) {
                                   for (var i = 0; i < $scope.searchPeople.length; i++) {
                                       angular.forEach($scope.searchPeople[i], function(value, key){
                                         if (key =='topicsPlayed') {
                                           var topicKey = value;
                                           angular.forEach(topicKey,function(value,index){

                                             if (value.topicId == $scope.topicVal) {

                                                $scope.topicSortList.push({topicId:value.topicId,gamesPlayed:value.gamesPlayed,name:$scope.searchPeople[i].name,image:$scope.searchPeople[i].imageLink,userId:$scope.searchPeople[i].userId});

                                             }
                                           });
                                         }
                                       });
                                   }
                                 }
                         },
                         function(errorResponse) {
                           console.log('Error in fetching data.');
                           console.log(errorResponse.status);
                           console.log(errorResponse.statusText);
                         }
                       );
                     }
                   }
                   $scope.selectedUser=function(selectedLocal) {
                     console.log(selectedLocal);
                     $('body').removeClass('modal-open');
                     $('.modal-backdrop').remove();
                     $scope.viewUserProfile(selectedLocal.userId)
                   }

      //end
  $http({
    method: 'GET',
    url: '/userProfile/profileData'
  })
  .then(function(successResponse) {
    $scope.data = successResponse.data.user;
    $rootScope.loggedInUser = successResponse.data.user;
    $rootScope.friends = successResponse.data.friends;
    $scope.topicsFollowed = [];
    if ($rootScope.loggedInUser.topicsPlayed != null) {
      for (var i = 0; i < $rootScope.loggedInUser.topicsPlayed.length; i++) {
        if ($rootScope.loggedInUser.topicsPlayed[i].isFollowed) {
          $scope.topicsFollowed.push($rootScope.loggedInUser.topicsPlayed[i]);
        }
      }
    }
    $rootScope.myImage = $rootScope.loggedInUser.imageLink;
    $rootScope.fakeMyName = $rootScope.loggedInUser.name;
    $rootScope.topperImage = $rootScope.loggedInUser.imageLink;
    $rootScope.userIdnew = $rootScope.loggedInUser.userId;
    //console.log($scope.topicsFollowed);

  }, function(errorResponse) {
    if (errorResponse.status === 401) {
      $rootScope.isAuthenticatedCookie = false;
      console.log('User not authenticated by Passport.');
    }
    $rootScope.serverErrorMsg = errorResponse.data.error;
    $rootScope.serverErrorStatus = errorResponse.status;
    $rootScope.serverErrorStatusText = errorResponse.statusText;
    $location.path('/error');
    console.log('User profile could not be loaded!');
  });


  $scope.viewUserProfile = function(user) {
    $http({
      method: 'GET',
      url: '/userProfile/profileData/' + user,
      params: {
        userId: user
      }
    })
    .then(function(successResponse) {
      $rootScope.friendUser = successResponse.data.user;
      $rootScope.friendUser.acceptanceState = successResponse.data.isfriend == null ? undefined : successResponse.data.isfriend["acceptanceState"];
      $rootScope.friendUser.buttonText = $rootScope.friendUser.acceptanceState == 0 ? 'Request Sent' : $rootScope.friendUser.acceptanceState == 1 ? 'Friends' : $rootScope.friendUser.acceptanceState == 2 ? 'Cannot Send Request' : 'Send Friend Request'
      $rootScope.friendUser.disableButton = $rootScope.friendUser.acceptanceState != undefined;
      $rootScope.friendUser.friends = successResponse.data.friends;
      $scope.friendUser.topicsFollowed = [];
      if ($rootScope.friendUser.topicsPlayed != null) {
        for (var i = 0; i < $rootScope.friendUser.topicsPlayed.length; i++) {
          if ($rootScope.friendUser.topicsPlayed[i].isFollowed) {
            $scope.friendUser.topicsFollowed.push($rootScope.friendUser.topicsPlayed[i]);
          }
        }
      }
      $location.path('/friendUserProfile/' + $rootScope.friendUser.name);
    }, function(errorResponse) {
      console.log(errorResponse);
    });
  };

  $scope.sendFriendRequest = function(currentUserProfile) {
        var friendshipData = {
          userIds: [],
          acceptanceState: 0,
          lastUpdatedDate: new Date()
        };
        friendshipData.userIds.push($rootScope.loggedInUser);
        friendshipData.userIds.push(currentUserProfile); // to do : Should work on retrieving the Object
        $http({
          method: 'POST',
          data: friendshipData,
          url: 'userProfile/userSettings/sendFriendRequest'
        })
        .then(function(successResponse) {
          $rootScope.friendUser.buttonText = "Request Sent";
          $rootScope.friendUser.disableButton = true;
          var notificationsMeta = {
            from: $rootScope.loggedInUser.userId,
            to: currentUserProfile.userId,
            type: 'FRND',
          }
          $http({
            method: 'POST',
            data: notificationsMeta,
            url: '/notifications'
          }).then(function(notificationRes) {
            console.log(notificationRes);
            $rootScope.$broadcast('sent:a:frndreq', 1);
          }
      , function(failureResponse) {
          console.log(failureResponse);
        })
    })
  };

    $scope.Unfriend = function(user) {
      var currentUserProfile = $rootScope.loggedInUser._id;
      var friendUserId = user._id
      $http({
        method: 'POST',
        data: {
            friendUserId,currentUserProfile
        },
        url: 'userProfile/userSettings/unfriendUser'
      }).
      then(function(response){
        $scope.viewUserProfile(user.userId)
      })
    }

  $scope.Unfriend = function(user) {
    var currentUserProfile = $rootScope.loggedInUser._id;
    var friendUserId = user._id
    $http({
      method: 'POST',
      data: {
        friendUserId,currentUserProfile
      },
      url: 'userProfile/userSettings/unfriendUser'
    }).
    then(function(response){
      $scope.viewUserProfile(user.userId)
    })
  }

  $scope.showFollowedTopic = function(topicID) {
    var path = '/topic/' + topicID;
    $location.path(path);
  };
  $scope.play = function() {
    $location.path("/categories");
  }
  $rootScope.socket.on('refreshUser', function(refreshData) {
    console.log('Refresh user recevied.');
    $rootScope.loggedInUser = refreshData.user;
  });
  $rootScope.tournamentSocket.on('refreshUser', function(refreshData) {
    console.log('Refresh user recevied.');
    $rootScope.loggedInUser = refreshData.user;
  });
  $http({
    method: 'GET',
    url: '/tournamentHandler/tournaments'
  })
  .success(function(data) {
    $scope.tournaments = data;
  })
}
});
