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
    .controller('userProfileController',function($http,$scope,$rootScope,$location,ngToast,$ajaxService, $badges){

      function init(){
        $ajaxService.getBadgesById({badgeIds: $rootScope.loggedInUser.badges,
        requestType:'getBadgesById'},
          function(err, result){
          if(err)
            console.log(err);
          $badges.setUserBadges(result.data);
          $scope = angular.extend($scope,{
            userBadgeArr : $badges.getUserBadges(),
            lastWonBadge : []
          });
          $scope.lastWonBadge = $scope.userBadgeArr[$scope.userBadgeArr.length-1];
        });
      }

      // redirect to login page if the user's isAuthenticated cookie doesn't exist
      if( !$rootScope.isAuthenticatedCookie ){
        $rootScope.logInLogOutErrorMsg = 'You are logged out. Kindly Login...';
        $rootScope.logInLogOutSuccessMsg = '';
        $location.path('/login');
      } else {
        $rootScope.hideFooterNav = false;
        $rootScope.stylesheetName="userProfile";
        $scope.a=7;
        $scope.see = true;
        $scope.btnImg = "images/userProfileImages/seeall.jpg";
        $scope.recentGameResults = [];
        for ( game in $rootScope.recentGames ) {
          $scope.recentGameResults.push( $rootScope.recentGames[game] );
        }
        $scope.showTournamentDetails = function( tournamentId ) {
          $location.path( '/tournament/' + tournamentId );
        };
        //added for test
        $scope.createTournament = function() {
          $location.path( '/tournamentHandler/createTournament');
        };
        //end
        $scope.seeHide = function(length){
         if($scope.see){
           $scope.see = false;
           $scope.btnImg = "images/userProfileImages/hide.jpg";
           $scope.a=length;
         }
         else{
           $scope.see = true;
           $scope.btnImg = "images/userProfileImages/seeall.jpg";
           $scope.a=7;
         }
        }
        $scope.showRecentResult = function( gameId ) {
          $rootScope.isComingFromTournament = false;
          $rootScope.showRecentResult = true;
          $location.path( '/quizResult/' + gameId );
        }


        $rootScope.socket.on('gameBadge',function(data) {
          console.log('hello from tost'+data.userId);
          if($rootScope.loggedInUser.userId===data.userId){
              console.log("user is " + data.userId);
              console.log("badge is "+ data.badgeId);
              ngToast.create({
                className :"warning",
                content : "You have won the "+data.badgeId+" badge!!!",
                dismissButton: true,
                timeout:60000
              });
              //$rootScope.loggedInUser.badgeCount = 12;
              //console.log($rootScope.loggedInUser.badgeCount);
          }
          else {
              console.log("I am not the user for this badge");
          }
        })

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

      $http({method : 'GET',url:'/userProfile/profileData'})
        .then( function( successResponse ){
          $scope.data = successResponse.data.user;
          $rootScope.loggedInUser = successResponse.data.user;
          $scope.topicsFollowed = [];
          if($rootScope.loggedInUser.topicsPlayed != null) {
            for(var i = 0;i < $rootScope.loggedInUser.topicsPlayed.length;i++){
              if( $rootScope.loggedInUser.topicsPlayed[i].isFollowed){
                $scope.topicsFollowed.push( $rootScope.loggedInUser.topicsPlayed[i] );
              }
            }
          }
          $rootScope.myImage = $rootScope.loggedInUser.imageLink;
          $rootScope.fakeMyName = $rootScope.loggedInUser.name;
          $rootScope.topperImage = $rootScope.loggedInUser.imageLink;
          $rootScope.userIdnew = $rootScope.loggedInUser.userId;
          init();
          $http({method : 'GET',url:'/analyticsDataHandler/getGameVisitStatForUser',
                  params:{
                              userId:$rootScope.userIdnew,
                              year: new Date().getFullYear()
                          }
              })
          .then(function successCallback(response){
            $scope.visitAndGameData = response.data;
            $scope.chart ={
                data: {
                      json: $scope.visitAndGameData,
                      keys: {
                          x: 'Month',
                          value: ['Visit Count','Game Played Count']
                      },
                      type: 'spline'
                  },
                  axis: {
                      x: {
                          type: 'category', // this needed to load string x value
                          tick: {
                              fit: false
                          }
                      }
                  }
              }
              $scope.loadVisitData = true;
            console.log( $scope.visitAndGameData);
          },function errorCallback(err) {
              console.log("Error fetching data for visit and gamePlayed data " + err);
          });
          //console.log($scope.topicsFollowed);
          $http({
              method: 'GET',
              url: '/analyticsDataHandler/getProfileStatForUser',
              params:{userId:$rootScope.loggedInUser.userId}
            }).then(function successCallback(response) {
              for (i=0;i<4;i++){
                if (response.data[i].label==='Total Wins'){
                  $rootScope.loggedInUser['winRank']=response.data[i].rank;
                  // console.log('total wins');
                }
                if (response.data[i].label==='Total Points'){
                  // console.log('total Points');
                  $rootScope.loggedInUser['pointsRank']=response.data[i].rank;
                  $rootScope.loggedInUser['gamePlayedCount']=((response.data[i].userStreak.gamePlayedCount==='--')?0:response.data[i].userStreak.gamePlayedCount);
                  $rootScope.loggedInUser['gamePlayedCountCur']=((response.data[i].userStreakCurrent.gamePlayedCount==='--')?0:response.data[i].userStreakCurrent.gamePlayedCount);

                  var monthNames = [
                        "Jan", "Feb", "Mar",
                        "Apr", "May", "Jun", "Jul",
                        "Aug", "Sept", "Oct",
                        "Nov", "Dec"
                      ];
                  var len=response.data[i].userStreak.streakDates.length;
                  if(len>=1){
                    var date = new Date(response.data[i].userStreak.streakDates[0]);
                    var day = date.getDate();
                    var monthIndex = date.getMonth();
                    var year = date.getFullYear();
                    var streakFromDate =day+" "+monthNames[monthIndex]+" "+year;
                    date = new Date(response.data[i].userStreak.streakDates[len-1]);
                    day = date.getDate();
                    monthIndex = date.getMonth();
                    year = date.getFullYear();
                    var streakToDate =day+" "+monthNames[monthIndex]+" "+year;
                    $rootScope.loggedInUser['streakDays']=len;
                    $rootScope.loggedInUser['streakDate']='('+streakFromDate+' - '+streakToDate+')';
                    $rootScope.loggedInUser['bestScore'] = response.data[i].userStreak.bestScore;
                  }
                  else{
                    $rootScope.loggedInUser['streakDate']='';
                    $rootScope.loggedInUser['streakDays']=0;
                  }
                  var lenC=response.data[i].userStreakCurrent.streakDates.length;
                  if(lenC>=1){
                    var date = new Date(response.data[i].userStreakCurrent.streakDates[0]);
                    var day = date.getDate();
                    var monthIndex = date.getMonth();
                    var year = date.getFullYear();
                    var streakFromDate =day+" "+monthNames[monthIndex]+" "+year;
                    date = new Date(response.data[i].userStreakCurrent.streakDates[lenC-1]);
                    day = date.getDate();
                    var monthIndex = date.getMonth();
                    year = date.getFullYear();
                    var streakToDate =day+" "+monthNames[monthIndex]+" "+year;
                    $rootScope.loggedInUser['streakDaysCur']=lenC;
                    $rootScope.loggedInUser['streakDateCur']='('+streakFromDate+' - '+streakToDate+')';
                    $rootScope.loggedInUser['bestScoreCur'] = response.data[i].userStreakCurrent.bestScore;
                  }
                  else{
                    $rootScope.loggedInUser['streakDateCur']='';
                    $rootScope.loggedInUser['streakDaysCur']=0;
                  }


                }
                if (response.data[i].label==='Avg Response Time'){
                  $rootScope.loggedInUser['speedRank']=response.data[i].rank;
                  // console.log('speed');
                }
                if (response.data[i].label==='Correctness Ratio'){
                  $rootScope.loggedInUser['accuracyRank']=response.data[i].rank;
                }
              }
            }, function errorCallback(response) {
              console.log('server response with an error status for currentGameData');
            });
        }, function( errorResponse ) {
          if ( errorResponse.status === 401 ) {
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
        $rootScope.friendUser.buttonText = $rootScope.friendUser.acceptanceState == 0 ? 'Friend Request Pending' : $rootScope.friendUser.acceptanceState == 1 ? 'Friends' : $rootScope.friendUser.acceptanceState == 2 ? 'Cannot Send Request' : 'Send Friend Request'
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
      $rootScope.friendUser.buttonText = "Request Sent";
      $rootScope.friendUser.disableButton = true;
      var notificationsMeta = {
        from: $rootScope.loggedInUser,
        to: currentUserProfile,
        type: 'FRND'
      }
      $rootScope.notificationSocket.emit('sendFriendRequest', notificationsMeta);
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
        $scope.showFollowedTopic = function(topicID){
          var path = '/topic/'+topicID;
          $location.path(path);
        };
        $scope.play = function() {
          $location.path( "/categories" );
        }
        $rootScope.socket.on( 'refreshUser', function( refreshData ) {
          console.log('Refresh user recevied.');
          $rootScope.loggedInUser = refreshData.user;
        });
        $rootScope.tournamentSocket.on( 'refreshUser', function( refreshData ) {
          console.log('Refresh user recevied.');
          $rootScope.loggedInUser = refreshData.user;
        });
        $http({method : 'GET',url:'/tournamentHandler/tournaments'})
        .success(function(data){
          $scope.tournaments = data;
        });
      }
  });
