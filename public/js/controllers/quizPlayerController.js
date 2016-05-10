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
//   WITHOUT WARRANTIES OR gameFinished OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//
//   Name of Developers  Raghav Goel, Kshitij Jain, Lakshay Bansal, Ayush Jain, Saurabh Gupta, Akshay Meher
//                      + Anil Sawant

angular.module('quizRT')
    .controller('quizPlayerController', function($route, $scope, $timeout,$location, $interval, $http, $rootScope, $window, $cookies,$routeParams) {
      if ( !$rootScope.loggedInUser ) {
        $rootScope.isAuthenticatedCookie = false;
        $rootScope.serverErrorMsg = 'User not authenticated.';
        $rootScope.serverErrorStatus = 401;
        $rootScope.serverErrorStatusText = 'You are not logged in. Kindly do a fresh login.';
        $location.path('/error');
      } else {
        $rootScope.hideFooterNav = true;
        $scope.levelId = $rootScope.playGame.levelId;
        $scope.topicId = $rootScope.playGame.topicId;
        $scope.quizTitle = $rootScope.playGame.topicName;
        $scope.tournamentTitle = $rootScope.playGame.tournamentTitle;
        $scope.expiredUrl = $rootScope.playGame.expiredUrl;
        if ( $scope.levelId && $scope.levelId.length ) {
          $scope.roundCount = $scope.levelId.substring($scope.levelId.lastIndexOf("_") + 1);
        }
        $rootScope.stylesheetName = "quizPlayer";
        $scope.myscore = 0;
        $scope.correctAnswerers = 0;
        $scope.wrongAnswerers = 0;
        var playersPerMatch = $rootScope.playersPerMatch;
        $scope.pendingUsersCount = playersPerMatch;
        $scope.question = "Setting up your game...";
        console.log("WAITING FOR " + playersPerMatch +" OTHER PLAYERS");

        // levelId is defined for Tournaments only
        if($scope.levelId){
             $scope.levelDetails = "Round "+ $scope.roundCount + " : " + $scope.tournamentTitle;
        }else{
            $scope.levelDetails = "";
        }
        $scope.urlForGame=$rootScope.playGame.url;
        // watch when the user leaves the quiz-play page to show/hide footer nav
        $scope.$on( '$routeChangeStart', function(args) {
          $rootScope.hideFooterNav = false;
        });

        // create the playerData obj for the quiz gameManager to identify the player and his client
        var playerData = {
            levelId: $scope.levelId, // defined only for Tournaments
            topicId: $scope.topicId,
            userId: $rootScope.loggedInUser.userId,
            playerName: $rootScope.loggedInUser.name,
            playerPic: $rootScope.loggedInUser.imageLink,
            playersNeeded: playersPerMatch
        };

        console.log($location.path());
        console.log('/quizPlayer/'+$routeParams.topicId+'/'+$routeParams.urlId);
        $rootScope.expiredUrl=true;
        console.log($location.path()==='/quizPlayer/'+$routeParams.topicId+'/'+$routeParams.urlId);
        if($rootScope.firstUser==true){
          console.log("message from test"+$rootScope.playGame.expiredUrl);
          playerData.url=$rootScope.playGame.url;
          playerData.firstUser=true;

          console.log("hi");
          $rootScope.socket.emit('joinGamesOnDemand', playerData);
          $rootScope.firstUser=false;
          $scope.time = 30;
          $scope.waitInterval = $interval(function () {
            $scope.time--;
            if($scope.time==0){
              //$scope.expiredUrl=false;
              $rootScope.playGame.expiredUrl=false;
              $rootScope.socket.emit('expiredLink',{'expired':true});
              $interval.cancel($scope.waitInterval);

            $location.path('/topic/'+$routeParams.topicId);
            }
          }, 1000);
        }
        else if($location.path()==='/quizPlayer/'+$routeParams.topicName+'/'+$routeParams.topicId+'/'+$routeParams.urlId){
          $rootScope.socket.emit("checkForExpireURL",{'url':'/quizPlayer/'+$routeParams.topicName+'/'+$routeParams.topicId+'/'+$routeParams.urlId});
          //console.log("paly Game second"+$rootScope.playGame.expiredUrl);
      }
        else{
        $rootScope.socket.emit('join', playerData); // enter the game and wait for other players to join
      }

      $rootScope.socket.on('checkedURL',function (data) {
        console.log("EXPIRED url----------"+data);
          if(data.checkedURL){
          //  $rootScope.expiredUrl=false;
          $http.post( '/topicsHandler/topic/'+ $routeParams.topicId )
          .then( function( successResponse ) {
            console.log("post",successResponse);
            //$rootScope.playGame = {};
            playerData.topicId=$routeParams.topicId;
            playerData.url=$routeParams.urlId;
            playerData.firstUser=false;
            $rootScope.isPlayingAGame = true;
            $scope.quizTitle = $routeParams.topicName;
            console.log(playerData);
            $rootScope.socket.emit('joinGamesOnDemand', playerData);
          }, function( errorResponse ) {
            console.log(errorResponse.data.error);
          });


          }
          else{
              $location.path('/topic/'+$routeParams.topicId);
          }

      });
        $rootScope.socket.on( 'userNotAuthenticated', function() {
            $rootScope.isAuthenticatedCookie = false;
            $rootScope.serverErrorMsg = 'User not authenticated.';
            $rootScope.serverErrorStatus = 401;
            $rootScope.serverErrorStatusText = 'User session could not be found. kindly do a fresh login.';
            $rootScope.serverErrorStatusText = 'd';
            $location.path('/error');
            console.log('Problem maintaining the user session!');
        });


        $rootScope.socket.once('startGame', function( startGameData ) {
          $interval.cancel($scope.waitInterval);
          if ( startGameData.questions && startGameData.questions.length && startGameData.questions[0]) {
            $rootScope.freakgid = startGameData.gameId;
            $scope.playersCount = startGameData.playersNeeded;
            $scope.questionCounter = 0; // reset the questionCounter for each game
            $scope.question = "Starting Game ...";
            $scope.time = 3;
            $scope.timerSpan = $('#timer');
            $scope.shouldContinue=true;
	    // define initial value for skip flag
            $scope.skipFlag = 'initial';

            $scope.timeInterval = $interval( function() {
                console.log('$scope.skipFlag' +$scope.skipFlag);
                console.log("Starting Time interval block");
                $scope.time--;
                  if($scope.shouldContinue){
                    //waiting for counter to end to start the Quiz
                    if ($scope.time === 0) {
                        $scope.isDisabled = false;
                        $scope.wrongAnswerers = 0;
                        $scope.correctAnswerers = 0;
                        $scope.unattempted = $scope.playersCount;

                        if ( $scope.questionCounter == startGameData.questions.length ) {
                            $interval.cancel($scope.timeInterval);
                            $scope.options = null;
                            $scope.question = 'Game finished. Compiling the result...';
                            $scope.questionImage = null;
                            $scope.unattempted = 0;
                            $scope.finishGameData = {
                              gameId: startGameData.gameId,
                              tournamentId: $scope.tournamentId,
                              levelId: $scope.levelId,
                              topicId: startGameData.topicId
                            };
                            $rootScope.socket.emit( 'gameFinished', $scope.finishGameData );
                        }
                        else {
                            if(!$scope.currentQuestion) {
                                $scope.currentQuestion = startGameData.questions[$scope.questionCounter];
                                $scope.options = $scope.currentQuestion.options;
                                $scope.questionCounter++;
                                $scope.question = $scope.questionCounter + ". " +$scope.currentQuestion.question;
                                if ($scope.currentQuestion.image != "null")
                                    $scope.questionImage = $scope.currentQuestion.image;
                                else {
                                    $scope.questionImage = null;
                                }
                                $scope.time = 5;
        						// check if game is in 2nd question and still we see
                                // skig flag has same initial value
                                // console.log("1 questionCounter "+$scope.questionCounter);
                                // if($scope.questionCounter > 1 && $scope.skipFlag === "initial"){
                                //     // call emit for skipped vals
                                //     console.log("first if emit skip ");
                                //     $rootScope.socket.emit('confirmAnswer', $scope.skipData);
                                // }
                                // else if($scope.questionCounter > 1 && $scope.skipFlag != "initial") {
                                //     $scope.skipFlag = 'initial';
                                // }
                                // set data for skip entry
                                $scope.skipData =  {
                                    ans: "skip",
                                    gameId: startGameData.gameId,
                                    topicId: startGameData.topicId,
                                    userId: $rootScope.loggedInUser.userId,
                                    responseTime: null,
                                    selectedOption:null,
                                    questionId : $scope.currentQuestion.questionId,
                                    questionNumber : $scope.questionCounter,
                                    gameTime: new Date().toString(),
                                    score : $scope.myscore
                                };
                            }
                            else {
                              $scope.shouldContinue = false;
                              $timeout(function(correctIndex) {
                                $('.selectedOptionTournament').removeClass('selectedOptionTournament btn-danger');
                                $('#'+correctIndex).removeClass('btn-success');
                                $scope.currentQuestion = startGameData.questions[$scope.questionCounter];
                                $scope.options = $scope.currentQuestion.options;
                                // console.log($scope.options);
                                $scope.questionCounter++;
                                $scope.question = $scope.questionCounter + ". " +$scope.currentQuestion.question;
                                if ($scope.currentQuestion.image != "null")
                                $scope.questionImage = $scope.currentQuestion.image;
                                else {
                                  $scope.questionImage = null;
                                }
                                $scope.time = 5;
                                $scope.shouldContinue = true;
                                // check if game is in 2nd question and still we see
                              // skig flag has same initial value
                              console.log("time is 1" +$scope.time);
                              console.log("$scope.skipFlag 2"  + $scope.skipFlag);
                              console.log("$scope.questionCounter  "+$scope.questionCounter);
                              if($scope.questionCounter > 1 && $scope.skipFlag === "initial"){
                                  // call emit for skipped vals
                                  console.log("second if emit ");
                                  $rootScope.socket.emit('confirmAnswer', $scope.skipData);
                              }
                              else if($scope.questionCounter > 1 && $scope.skipFlag != "initial") {
                                  $scope.skipFlag = 'initial';
                              }
                              // set data for skip entry
                              $scope.skipData =  {
                                  ans: "skip",
                                  gameId: startGameData.gameId,
                                  topicId: startGameData.topicId,
                                  userId: $rootScope.loggedInUser.userId,
                                  responseTime: null,
                                  selectedOption:null,
                                  questionId : $scope.currentQuestion.questionId,
                                  questionNumber : $scope.questionCounter,
                                  gameTime: new Date().toString(),
                                  score : $scope.myscore
                              };
                              },20,true,$scope.currentQuestion.correctIndex);

                        }
                        $scope.changeColor = function(id, element) {
                          angular.element(element.target).addClass('selectedOptionTournament');
                          var correctIndexId = $scope.currentQuestion.correctIndex;
                          if($('.selectedOptionTournament').attr('id') == correctIndexId){
                            $('#'+$scope.currentQuestion.correctIndex).addClass('btn-success');
                            $scope.myscore = $scope.myscore+$scope.time+10;
                            $scope.skipFlag = false;
                            $scope.skipFlag = 'modified';
                            $rootScope.socket.emit('confirmAnswer', {
                                    ans: "correct",
                                    gameId: startGameData.gameId,
                                    topicId: startGameData.topicId,
                                    userId: $rootScope.loggedInUser.userId,
                                    responseTime: $scope.time,
                                    selectedOption:id,
                                    questionId : $scope.currentQuestion.questionId,
                                    questionNumber : $scope.questionCounter,
                                    gameTime: new Date().toString(),
                                    score : $scope.myscore
                                });
                          }
                          else{
                          $('.selectedOptionTournament').addClass('btn-danger');
                          $('#'+$scope.currentQuestion.correctIndex).addClass('btn-success');
                          $scope.myscore = $scope.myscore - 5;
                                $scope.skipFlag = false;
                                $scope.skipFlag = "modified";
                                $rootScope.socket.emit('confirmAnswer', {
                                    ans: "wrong",
                                    gameId: startGameData.gameId,
                                    topicId: startGameData.topicId,
                                    userId: $rootScope.loggedInUser.userId,
                                    responseTime:$scope.time,
                                    selectedOption:id,
                                    questionId : $scope.currentQuestion.questionId,
                                    questionNumber : $scope.questionCounter,
                                    gameTime: new Date().toString(),
                                    score : $scope.myscore
                                });
                        }
                          $scope.isDisabled = true;
                          var obj = {
                            gameId: startGameData.gameId,
                            topicId: startGameData.topicId,
                            selectedId:id,
                            // selectedElm:element,
                            correctIndex:$scope.currentQuestion.correctIndex,
                            // myScore:$scope.myscore,
                            scopeTime:$scope.time,
                            userId:$rootScope.loggedInUser.userId
                          };
                          console.log(obj);
                      $rootScope.socket.emit('updateStatus', {
                          gameId: startGameData.gameId,
                          topicId: startGameData.topicId,
                          userId: $rootScope.loggedInUser.userId,
                          playerScore: $scope.myscore,
                          playerName: $rootScope.loggedInUser.name,
                          playerPic: $rootScope.loggedInUser.imageLink
                      });
                        };
                    }
                }



            }

              // last time check for skipped question
              console.log("time is end  " +$scope.time);
              console.log("$scope.skipFlag end  " + $scope.skipFlag);
              if ( $scope.time === 0  && $scope.skipFlag === 'initial'){
                  // emit skipped data
                  console.log("emitting Skip data...");
                  $rootScope.socket.emit('confirmAnswer', $scope.skipData);
              }

            }, 1000);// to create 1s timer
          } else {
            $rootScope.hideFooterNav = false;
            $scope.question = 'Selected topic does not have any questions in our QuestionBank :(';
          }

        });

        $rootScope.socket.on('takeScore', function(data) {
            $scope.myrank = data.myRank;
            $scope.topperScore = data.topperScore;
            $scope.topperImage = data.topperImage;
        });
        $rootScope.socket.on('isCorrect', function(data) {
            $scope.correctAnswerers++;
            $scope.unattempted--;
        });
        $rootScope.socket.on('isWrong', function(data) {
            $scope.wrongAnswerers++;
            $scope.unattempted--;
        });
        $rootScope.socket.on('pendingPlayers', function(data) {
            $scope.question = "WAITING FOR " + data.pendingPlayers +" OTHER PLAYER(S)";
        });
        $rootScope.socket.on('playerLeft', function(data) {
            $scope.playersCount = data.remainingCount;
            $scope.playerLeft = data.playerName + " left the game.";
        });
        $scope.$watch( 'playerLeft', function(nv,ov) {
          if ( nv ) {
            setTimeout( function() {
              $scope.playerLeft = '';
            },1000);
          }
        });
        $rootScope.socket.on('playerJoined', function( data ) {
          // $scope.playersCount = data.newCount;
          $scope.playerJoined = data.playerName + " joined the game.";
        });
        $scope.$watch( 'playerJoined', function(nv,ov) {
          if ( nv ) {
            $timeout( function() {
              $scope.playerJoined = '';
            },2000);
          }
        });
        $rootScope.socket.on( 'takeResult', function( resultData ) {
            $rootScope.recentGames[resultData.gameResult.gameId] = {
              error: resultData.error,
              topicId: resultData.gameResult.topicId,
              topicName: $scope.quizTitle,
              gameId: resultData.gameResult.gameId,
              gameBoard: resultData.gameResult.gameBoard
            };
            $location.path( '/quizResult/' + resultData.gameResult.gameId );
        });
        $rootScope.socket.on( 'alreadyPlayingTheGame', function( duplicateEntryData ) {
          $scope.question = 'WARNING!!  You are already playing ' + duplicateEntryData.topicId + '. Kindly complete the previous game or play a different one.';
          $rootScope.hideFooterNav = false;
        });
        $rootScope.socket.on( 'serverMsg', function( msgData ) {
          if (msgData.type == 'LOGOUT') {
            $cookies.remove('isAuthenticated');
            $rootScope.loggedInUser = null;
            $rootScope.isAuthenticatedCookie = false;
            $rootScope.logInLogOutErrorMsg = 'Server knocked out your session. This may be due to running multiple sessions.';
            $rootScope.logInLogOutSuccessMsg = '';
            $location.path('/login');
          }
        });
      }
    });

function loadNextQuestion( questions, questionNumber, $scope) {
    var optionCounter = 0;
    var obj;
    var options = [];
    while (questions[questionNumber].options[optionCounter]) {
        opt = {
            name: questions[questionNumber].options[optionCounter],
            id: "option" + (optionCounter + 1)
        };
        options.push(opt);
        optionCounter++;
    }
    obj = {
        "options": options,
        "question": questions[questionNumber].question,
        "image": questions[questionNumber].image,
        "correctIndex": questions[questionNumber].correctIndex,
        "questionId" : questions[questionNumber].questionId
    };
    $scope.questionCounter++;
    return obj;
}
