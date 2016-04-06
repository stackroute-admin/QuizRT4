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
    .controller('userProfileController',function($http,$scope,$rootScope,$location){

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
          //console.log($scope.topicsFollowed);
            $scope.dataActivity = {
             dataset0: [
               {x: 0, val_0: 0, val_1: 0, val_2: 0, val_3: 0},
               {x: 1, val_0: 0.993, val_1: 3.894, val_2: 8.47, val_3: 14.347},
               {x: 2, val_0: 1.947, val_1: 7.174, val_2: 13.981, val_3: 19.991},
               {x: 3, val_0: 2.823, val_1: 9.32, val_2: 14.608, val_3: 13.509},
               {x: 4, val_0: 3.587, val_1: 9.996, val_2: 10.132, val_3: -1.167},
               {x: 5, val_0: 4.207, val_1: 9.093, val_2: 2.117, val_3: -15.136},
               {x: 6, val_0: 4.66, val_1: 6.755, val_2: -6.638, val_3: -19.923},
               {x: 7, val_0: 4.927, val_1: 3.35, val_2: -13.074, val_3: -12.625}
             ]
           };

         $scope.optionsActivity = {
           series: [
             {
               axis: "y",
               dataset: "dataset0",
               key: "val_3",
               label: "Rank",
               color: "#036F41",
               type: ['line', 'dot', 'area'],
               id: 'mySeries0'
             }
           ],
           axes: {x: {key: "x"}}
         };
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
