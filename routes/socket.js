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
//                      + Anil Sawant

// var GameManager = require('./gameManager/GameManager.js'),
var GameManagerClass = require('./gameManager/gameManager.js'),
    GameManager = new GameManagerClass(),
    TournamentManager = require('./tournamentManager/tournamentManager.js');

module.exports = function(server,sessionMiddleware) {
  var io = require('socket.io')(server);
  io.use(function(socket,next){
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  io.on('disconnect',function(client){
    console.log( 'Server crashed. All the clients were disconnected from the server.');
  })

  var normalGameSocket = io
      .of('/normalGame')
      .on('connection', function(client) {
        if ( client.request.session && client.request.session.user ) {
          console.log( client.request.session.user + ' connected to QuizRT server. Socket Id: ' + client.id);
        }

        client.on('disconnect', function() {
          if ( client.request.session && client.request.session.user ) {
            GameManager.popPlayer( client.request.session.user ); // pop the user from all the games
            console.log( client.request.session.user + ' disconnected from QuizRT server. Socket Id: ' + client.id);
          }
        });
        client.on('logout', function( userData, done) {
          console.log( client.request.session.user + ' logged out.');
          done( GameManager.popPlayer( client.request.session.user ) );
          client.request.session.user = null;
      		client.request.logout();
        });

        client.on('join',function( playerData ) {
          levelMultiplier =playerData.levelMultiplier;
          console.log( playerData.userId + ' joined. Wants to play ' + playerData.topicId );
          // check if the user is authenticated and his session exists, if so add him to the game
          if ( client.request.session && (playerData.userId == client.request.session.user) ) {//req.session.user
            var gamePlayer = {
              userId: playerData.userId,
              playerName: playerData.playerName,
              playerPic: playerData.playerPic,
              client: client,
              score: 0,
              timer: 10

            };
            var difficultyLevelTopic=[1,2,3,4,5];//for topics game fetch questions from all difficulty levels
            var addedSuccessfully = GameManager.managePlayer( playerData.topicId, playerData.levelId, playerData.playersPerMatch, gamePlayer,difficultyLevelTopic); // add the player against the topicId.
            if ( addedSuccessfully === false ) {
              console.log('User is already playing the game ' + playerData.topicId + '. Cannot add him again.');
              client.emit('alreadyPlayingTheGame', { topicId: playerData.topicId });
            }
          } else {
            console.log('User session does not exist for: ' + playerData.userId + '. Or the user client was knocked out.');
            client.emit( 'userNotAuthenticated' ); //this may not be of much use
          }
        }); // end client-on-join


        client.on('confirmAnswer',function(data){
          console.log(new Date());
          console.log("Invookeddddddddd");
          console.log("Invoking Confirm Answer",data.selectedId);
          console.log(data.correctIndex);
          if (data.selectedId == data.correctIndex){
            // console.log();
            //increment correct of allplayers
            //decrement unsawered of all players
            GameManager.getGamePlayers(data.gameId).forEach( function( player, index) {

              if(player.userId==data.userId){
                console.log("insude if getGame...................................");
                player.score+=data.scopeTime+10;
                console.log("score is..................."+player.score);
                player.client.emit('highLightOption',{correct:true,myScore:player.score,correctInd:data.correctIndex});
              }

            });
            GameManager.getGamePlayers(data.gameId).forEach(function(player){
              player.client.emit('isCorrect');
            });
          }
          else{
            //increment wrong of allplayers
            //decrement unsawered of all players
            GameManager.getGamePlayers(data.gameId).forEach(function( player, index) {
              if(player.userId==data.userId){
                player.score-=5;
                player.client.emit('highLightOption',{correct:false,myScore:player.score});
              }

            });
            GameManager.getGamePlayers(data.gameId).forEach(function(player){
              player.client.emit('isWrong');
            });
          }
        });

        client.on('updateStatus',function( gameData ){
          console.log("-----------------------"+new Date());
          console.log("Update Status Got Invvoked");
          GameManager.getGamePlayers(gameData.gameId).forEach( function( player, index) {
            if(player.userId==gameData.userId){
              console.log("updated game player.score......"+player.score);
              gameData.playerScore=player.score;
              console.log("updated game player score......"+gameData.playerScore);
            }
          });
          if ( client.request.session && gameData.userId == client.request.session.user ) {
            GameManager.updateScore( gameData.gameId, gameData.userId, gameData.playerScore );

            var intermediateGameBoard = GameManager.getLeaderBoard( gameData.gameId ),
                myRank = 0,
                gameTopper = intermediateGameBoard[0];
            intermediateGameBoard.some( function(player, index ) {
              if ( player.userId == gameData.userId ) {
                myRank = index + 1;
                return true;
              }
            });
            GameManager.getGamePlayers(gameData.gameId).forEach( function( player, index) {
              player.client.emit('takeScore', {myRank: myRank, userId: client.request.session.user, topperScore:gameTopper.score, topperImage:gameTopper.playerPic });
            });
          } else {
            console.log('User session does not exist for the user: ' + gameData.userId );
          }
        });

        client.on( 'gameFinished', function( game ) {
          GameManager.finishGame( game );
        });

        client.on('leaveGame', function( gameId ){
          GameManager.leaveGame( gameId, client.request.session.user );
        });

        client.on('getOnlineFriends', function(myuserId) {
          console.log("Get Online Users");
          GameManager.getUserDetails(client);
        });

      });// end normalGameSocket



      var tournamentSocket = io
          .of('/tournament')
          .on('connection', function(client) {
            if ( client.request.session && client.request.session.user ) {
              console.log( client.request.session.user + ' connected to QuizRT server. Tournament Socket Id: ' + client.id);
            }

            client.on('disconnect', function() {
              if ( client.request.session && client.request.session.user ) {
                TournamentManager.popPlayer( client.request.session.user );
              }
            });

            client.on('logout', function( userData, done) {
              console.log( client.request.session.user + ' logged out.');
              if ( client.request.session && client.request.session.user ) {
                TournamentManager.popPlayer( client.request.session.user );
                client.request.session.user = null;
              }
          		client.request.logout();
            });

            client.on('joinTournament',function( playerData ) {
              levelMultiplier = playerData.levelMultiplier;
              console.log( playerData.userId + ' joined. Wants to play ' + playerData.topicId + ' of tournament ' + playerData.levelId  );

              if ( client.request.session && (playerData.userId == client.request.session.user) ) {//req.session.user
                var gamePlayer = {
                  userId: playerData.userId,
                  playerName: playerData.playerName,
                  playerPic: playerData.playerPic,
                  score:0,
                  client: client
                };

                var addedSuccessfully = TournamentManager.managePlayer( playerData, gamePlayer ); // add the player against the topicId.
                if ( addedSuccessfully === false ) {
                  console.log('User is already playing the game ' + playerData.topicId + ' of ' + playerData.tournamentId + '. Cannot add him again.');
                  client.emit('alreadyPlayingTheGame', { levelId: playerData.levelId, tournamentId: playerData.tournamentId, topicId: playerData.topicId });
                }
              } else {
                console.log('User session does not exist for: ' + playerData.userId + '. Or the user client was knocked out.');
                client.emit( 'userNotAuthenticated' ); //this may not be of much use
              }
            }); // end client-on-joinTournament


            client.on('confirmAnswer',function( data ){
              console.log("Printingg Data Blahhhhh",data);
              if(data.selectedId == data.correctIndex) {
                var gameManager = TournamentManager.getGameManager( data.tournamentId ),
                    gamePlayers = gameManager ? gameManager.getGamePlayers( data.gameId ) : null ;
                  gamePlayers.forEach( function( player, index) {
                    console.log("------------------------   ------------------------------------   ------------------------------------"+player.userId+" "+player.score);
                      if(player.userId==data.userId){
                        console.log("inside if getGameTournament...................................");
                        player.score+=data.responseTime+10;
                        console.log("tournament score is..................."+player.score);
                        player.client.emit('highLightOption',{correct:true,myScore:player.score,correctInd:data.correctIndex});
                      }

                    });
                if ( gamePlayers && gamePlayers.length ) {
                  gamePlayers.forEach( function(player, index) {
                    player.client.emit('isCorrect');
                  });
                } else {
                  console.log('ERROR: Cannot find the gameManager for ' + data.tournamentId );
                }
              } else {
                var gameManager = TournamentManager.getGameManager( data.tournamentId ),
                     gamePlayers = gameManager ? gameManager.getGamePlayers( data.gameId ) : null ;
                    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"+gamePlayers);
                    gamePlayers.forEach(function( player, index) {
                      if(player.userId==data.userId){
                        player.score-=5;
                        player.client.emit('highLightOption',{correct:false,myScore:player.score});
                      }

                    });
                if ( gamePlayers && gamePlayers.length ) {
                  gamePlayers.forEach( function(player) {
                    player.client.emit('isWrong');
                  });
                } else {
                  console.log('ERROR: Cannot find the gameManager for ' + data.tournamentId );
                }
              }
            });

            client.on('updateStatus',function( gameData ){
              var gameManager = TournamentManager.getGameManager( gameData.tournamentId ),
                  gamePlayers = gameManager ? gameManager.getGamePlayers( gameData.gameId ) : null ;
                  gamePlayers.forEach(function( player, index) {
                    if(player.userId==gameData.userId){
                      if (levelMultiplier && player.score>0) {
                        gameData.playerScore=player.score * levelMultiplier;
                      }else {
                        gameData.playerScore = player.score;
                      }
                    }
                  });

              if ( gameManager ) {
                gameManager.updateScore( gameData.gameId, gameData.userId, gameData.playerScore );
                var intermediateGameBoard = gameManager.getLeaderBoard( gameData.gameId ),
                    myRank = 0,
                    gameTopper = intermediateGameBoard[0];
                intermediateGameBoard.some( function(player, index ) {
                  if ( player.userId == gameData.userId ) {
                    myRank = index + 1;
                    // gameData.playerScore = player.score ;
                    return true;
                  }
                });
                if ( gamePlayers && gamePlayers.length ) {
                  gamePlayers.forEach( function( player, index) {

                  if (levelMultiplier && gameTopper.score>0) {
                    tempTopperScore = gameTopper.score/levelMultiplier;
                  }else {
                     tempTopperScore =  gameTopper.score;
                    }
                    player.client.emit('takeScore', {myRank: myRank, userId: client.request.session.user, topperName:gameTopper.playerName, topperScore:tempTopperScore, topperImage:gameTopper.playerPic });
                  });
                }
              } else {
                console.log('ERROR:UPDATE - Cannot find the gameManager for ' + gameData.tournamentId );
              }
            });

            client.on( 'gameFinished', function( finishGameData ) {
              TournamentManager.finishGame( finishGameData );
            });


            client.on('leaveGame', function( gameData, done ){
              var gameManager = TournamentManager.getGameManager( gameData.tournamentId );
              if( gameManager ) {
                gameManager.leaveGame( gameData.gameId, client.request.session.user );
                done( {error:null} );
              } else {
                console.log('ERROR: Failed to find the gameManager for ' + gameData.tournamentId );
                done( {error: 'Could not leave the game.'} );
              }
            });
          });// end tournament socket

          var notificationSocket = io
              .of('/notification')
              .on('connection', function(client) {
                  client.on('respond:to:frndreq',function(data){
                      console.log('recieved a notification');
                  });
              });
}
