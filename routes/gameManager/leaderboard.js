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
//   Name of Developers  Anil Sawant

var LeaderBoard = function() {
  this.games = new Map(); // holds leaderBoards for all the games

  /**
  ** @param gameId as String, players as an Array
  ** @return true if the game leaderBoard was created, otherwise false
  */
  this.createNewLeaderBoard = function( gameId, players, callback) {
    if ( !(typeof gameId === 'string') || !Array.isArray( players ) || !(typeof callback === 'function') ) {
      callback(new Error('Parameter type error.'));
      return;
    }
    if( this.games.has( gameId ) ) { // leaderBoard for the gameId already exists return false
      callback( new Error('Game already exists. Cannot create two LeaderBoards for one game.') );
      return;
    }
    this.games.set( gameId, players); // add the leaderBoard against the gameId
    callback( null, this.games.get( gameId ) ); // return the reference to the newly created leaderBoard
    return;
  };

  /**
  ** @param gameId as String
  ** @return leaderBoard for the gameId
  */
  this.get = function( gameId ) {
    return this.games.get( gameId );
  };

  /**
  ** @param gameId as String, userId as String, score as Number
  ** @return true if the score was updated for the userId, for the gameId, and the respective LeaderBoard was updated
  */
  this.updateScore = function( gameId, userId, score) {
    if( this.games.has( gameId ) ) {
      var scoreUpdated = this.games.get( gameId ).some( function( player ) {
        if( player.userId == userId ){
          player.score = score;
          return true; // loop breaking condition
        }
        return false;
      });

      if ( scoreUpdated ) { // if the player, game was found and the score was updated
        this.games.get( gameId ).sort( function(a,b) { // refresh the leaderBoard
          return b.score-a.score;                     // this is requred to get the gameTopper after every question
        });
        return true;// return true if updateScore completed properly
      }
      return false; // if the player was not found return false
    }
  };

  /**
  ** @param gameId as String
  ** @return true if the game leaderBoard was deleted, false otherwise
  */
  this.dissolve = function( gameId ) {
    if ( this.games.has( gameId ) ) {
      this.games.delete( gameId );
      return true;
    }
    return false;
  };
}
module.exports = new LeaderBoard();
