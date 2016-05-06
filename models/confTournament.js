var mongoose = require('mongoose'),
    Topic = require('./topic'),
    Profile = require('./profile'),
    confTournamentSchema = mongoose.Schema({
      _id: String,
      title:String,
      description:String,
      matches:Number,
      playersPerMatch:Number,
      imageUrl:String,
      tournamentFollowers: {type:Number,default:0},
      rulesDescription : String,
      totalGamesPlayed:{type:Number,default:0},
      startDate : {type: Date},
      endDate : {type: Date},
      leaderBoard: [{
        userId: { type: String, ref: 'Profile'},
        playerName:String,
        playerPic: String,
        totalScore: Number
      }],
      topics: [{
          levelId:String,
          topicId:{type: String, ref: 'Topic'},
          questionPaper:String,
          tournamentType:String,
          difficultyLevel:[String],
          games:[{type: String, ref: 'Game'}]
       }],
       registration : {
        startDate : {type: Date},
        endDate   : {type: Date}
      }
    }),
    confTournament = mongoose.model('confTournament', confTournamentSchema);

module.exports = confTournament;
