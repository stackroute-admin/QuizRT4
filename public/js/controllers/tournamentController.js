  angular.module("quizRT")
      .controller('tournamentController', function($scope, $http, $routeParams, $rootScope, $location){
        // redirect to login page if the user's isAuthenticated cookie doesn't exist
        if( !$rootScope.isAuthenticatedCookie ){
          $rootScope.logInLogOutErrorMsg = 'You are logged out. Kindly Login...';
          $rootScope.logInLogOutSuccessMsg = '';
          $location.path('/login');
        } else {
          $scope.tournamentId=$routeParams.tournamentId;
          $rootScope.stylesheetName="tournament";
          $scope.levelCleared = 0;
          $scope.playedTournament = {};
          var path = '/tournamentHandler/tournament/'+ $scope.tournamentId;

          /*
          $scope.$on( '$routeChangeSuccess', function(args) {
            // there's one watcher in quizPlayerController to show-hide the footer-nav when user is playing a quiz
            // if footer-nav doesn't show/hide properly
            // use this watcher in every page where footer-nav should be visible
            // $rootScope.hideFooterNav = false;
          });
          */

          // function to toggle the player details
          $scope.toggleLeaderBoardPlayerdetails = function( playerId ) {
            $('#' + playerId).slideToggle();
          };
          // function to calculate the rank of a player, also giving same rank to players with same score
          $scope.prevRank = 1;
          $scope.prevScore = 0;
          $scope.calculateRank = function( nextScore, runningIndex ) {
            if ( $scope.prevScore != nextScore ) {
              $scope.prevScore = nextScore;
              $scope.prevRank = runningIndex+1;
            }
            return $scope.prevRank;
          };
          $scope.refreshTournament = function( tournamentId ) {
            $http.get( '/tournamentHandler/tournament/' + tournamentId )
               .then(function( successResponse ) {
                 successResponse.data.tournament.leaderBoard.sort( function(a,b) {
                   return b.totalScore - a.totalScore;
                 });
                 successResponse.data.tournament.leaderBoard.some( function(player,index) {
                   if ( player.userId && player.userId == $rootScope.loggedInUser.userId ) {
                     $scope.userTournamentStats = player;
                     $scope.userTournamentStats.rank = index+1;
                     return true;
                   }
                 });

                 $scope.tournament = successResponse.data.tournament;
            //  console.log("jjjjjjjjjjjjjjjj    jjjjjjjjjjjjjjjjjjj"+successResponse.data.tournament.topics["topicName"]);
                 $rootScope.playersPerMatch = successResponse.data.tournament.playersPerMatch;

                 $rootScope.loggedInUser.tournaments.forEach(function(tournament){
                   if(tournament.tournamentId == successResponse.data.tournament._id){
                     $scope.playedTournament = tournament;
                     $scope.levelCleared = tournament.levelCleared;
                   }
                 });
              }, function( errorResponse ) {
                  console.log('Failed to refresh the leader board. Showing old data.');
              });
          }
          $scope.refreshTournament( $scope.tournamentId );// call for the first time

          $scope.playTournament = function(levelId, topicId, title, topic_name,difficultyLevel,levelMultiplier) {

            var tournamentId = levelId ? levelId.substring(0, levelId.indexOf('_')) : null;
            $rootScope.playGame = {};
            console.log("pppppppppp ppppppppppppp"+difficultyLevel);
            $rootScope.playGame.levelId = levelId;
            $rootScope.playGame.tournamentId = tournamentId;
            $rootScope.playGame.topicId = topicId;
            $rootScope.playGame.topicName = topic_name;
            $rootScope.playGame.levelMultiplier = levelMultiplier;
            $rootScope.playGame.tournamentTitle = title;
            $rootScope.playGame.difficultyLevel = difficultyLevel;
            if ( $rootScope.playGame.topicId && $rootScope.playGame.tournamentId ) {
              $location.path( '/tournamentArena' );
              $rootScope.hideFooterNav = true;
            } else {
              console.log('Cannot play. tournamentId or topicId is undefined!!');
            }

          };

          $scope.showPlayButton = function(index){
             var currentDate = new Date();
             currentDate.setHours(0,0,0,0);
             var tournamentStartDate = new Date($scope.tournament.startDate);
             var tournamentEndDate = new Date($scope.tournament.endDate);
             var showPlayButton = false;
          if(index == $scope.levelCleared && (tournamentStartDate.getTime() <= currentDate.getTime()) && (currentDate.getTime() <= tournamentEndDate.getTime())) {
            showPlayButton = true;
          }
          if(index == $scope.levelCleared ) {
            showPlayButton = true;
          }
          return showPlayButton;
         }
       }
    });
