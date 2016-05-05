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
          $scope.topics = successResponse.data;
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
      $scope.hideTopic=function(changedTopicVal){
        $scope.changedTopicVal = null;
      }
      $scope.getVal=function(changedVal){
        radioVal=changedVal;
      }

      $scope.clearSearch = function(){
        $scope.user = null;
        $scope.topicData = null;
        $scope.searchPeople = null;
      }

      $scope.selectedTopic=function(value){
        $scope.topicVal = value;
        console.log("inside function:"+  $scope.topicVal);
      }
      $scope.userData = function (user) {
        inputData = {name:user,radio:radioVal,selectTopic:$scope.topicVal};

        $http({
          method : 'GET',
          url : '/userProfile/searchPeople',
          params : inputData
        }) .then(
          function(successResponse) {
            $scope.searchPeople = successResponse.data;
            $scope.topicData = false;
          },
          function(errorResponse) {
            console.log('Error in fetching data.');
            console.log(errorResponse.status);
            console.log(errorResponse.statusText);
          }
        )
      }

    }
    $scope.selectedUser=function(selectedLocal) {
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $scope.viewUserProfile(selectedLocal.userId)
    }

    $http({
      method: 'GET',
      url: '/userProfile/profileData'
    })
    .then(function(successResponse) {
      $scope.data = successResponse.data.user;
      $rootScope.loggedInUser = successResponse.data.user;
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
        $rootScope.friendUser.buttonText = $rootScope.friendUser.acceptanceState == 0 ? 'Send Request Reminder' : $rootScope.friendUser.acceptanceState == 1 ? 'Unfriend' : $rootScope.friendUser.acceptanceState == 2 ? 'Cannot Send Request' : 'Send Friend Request'
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
      if (currentUserProfile) {
        if ($rootScope.friendUser.acceptanceState == undefined) {
          var friendshipData = {
            userIds: [],
            acceptanceState: 0,
            lastUpdatedDate: new Date()
          };
          friendshipData.userIds.push($rootScope.loggedInUser);
          friendshipData.userIds.push(currentUserProfile); // to do : Should work on retrieving the Object
          debugger;
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
              $rootScope.$broadcast('sent:a:frndreq', 1);
            })
          }, function(failureResponse) {
            console.log(failureResponse);
          })
        };
      }
    };

    $scope.acceptFriendRequest = function(user, friendUser) {
      $http({
        method: 'POST',
        data: {
          user,
          friendUser
        },
        url: 'userProfile/userSettings/acceptFriendRequest'
      })
      .then(function(successResponse) {
        console.log('Friend Request Accepted');
      }, function(failureResponse) {
        console.log(failureResponse);
      });
    }

    $scope.rejectFriendRequest = function(user, friendUser) {
      $http({
        method: 'POST',
        data: {
          user,
          friendUser
        },
        url: 'userProfile/userSettings/rejectFriendRequest'
      })
      .then(function(successResponse) {
        console.log('Friend Request Accepted');
      }, function(failureResponse) {
        console.log(failureResponse);
      });
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
    });
  }
});
