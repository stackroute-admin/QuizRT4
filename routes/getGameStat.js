// Module to fetch different analytics data from the analyticsDB

//  require model and db conf file to analytics db
var userAnalyticsSchema = require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema);

module.exports = {
    // function to return game stat for a given game and a user
    getCurrentGameStat: function(userId, gameId, done) {
        userAnalytics.aggregate(
            [
                 { $match:
                    {
                        'userId': userId,
                        'tournamentId':'null',
						gameId: gameId
                    }
                 },
                 { $group:
                     {
                         _id:  "$topicId" ,
						  currectCount: {$sum: { "$cond": [{ "$eq": [ "$isCorrect", true ] }, 1, 0 ] }},
						  wrongCount: {$sum: { "$cond": [{ "$eq": [ "$isCorrect", false ] }, 1, 0 ] }}

                     }
                 }
            ], function(err, result){
                if (err) {
                   console.log(err);
                //    analyticsDbObj.close();
                   // pass error object
                   done( { 'error': 'dbErr'} );
               } else {
                   console.log("Fetched result !!");
                //    analyticsDbObj.close();
                   done(result);
               }
            });
  }, // end of function getCurrentGameStat

  getAnsStat: function(userId, gameId, isCorrect, done) {
    userAnalytics.aggregate(
            [
                 { $match:
                    {
                        'userId': userId,
                        'tournamentId':'null',
						gameId: gameId,
						'isCorrect': isCorrect
                    }
                 },
                 { $group:
                     {
                         _id:  "$topicId" ,
						  responseTime: {$sum: "$responseTime"}

                     }
                 }
            ],function(err, result){
                if (err) {
                   console.log(err);
                   analyticsDbObj.close();
                   // pass error object
                   done( { 'error': 'dbErr'} );
               } else {
                   console.log("Fetched result !!");
                   analyticsDbObj.close();
                   done(result);
               }
            }
    );
  }




};
