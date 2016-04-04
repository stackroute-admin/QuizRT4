// Module to fetch different analytics data from the analyticsDB

//  require model and db conf file to analytics db
var userAnalyticsSchema = require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema),
    Profile = require("../models/profile");
    // var mongoose = require('mongoose');
    // mongoose.connect('mongodb://localhost/quizRT3');

module.exports = {
    // function to return game stat for a given game and a user
    getCurrentGameStat: function(userId, gameId, done) {
        userAnalytics.aggregate(
            [
                 { $match:
                    {
                        userId: userId,
                        'tournamentId':'null',
						             gameId: gameId
                    }
                 },
                 { $group:
                     {
                         _id:  { topicId : "$topicId" ,userId : "$userId" },
						  correctCount: {$sum: { "$cond": [{ "$eq": [ "$responseType", 'correct' ] }, 1, 0 ] }},
						  wrongCount: {$sum: { "$cond": [{ "$eq": [ "$responseType", 'wrong' ] }, 1, 0 ] }},
                          skipCount: {$sum: { "$cond": [{ "$eq": [ "$responseType", 'skip' ] }, 1, 0 ] }}
                     }
                 },
                { "$project": {
                     _id : 0, //excludes the _id field
                     "topicId" : "$_id.topicId",
                     "userId" : "$_id.userId",
                     "correctCount": "$correctCount",
                     "wrongCount" : "$wrongCount",
                     "skipCount": "$skipCount"
                    }
                }

            ], function(err, result){
                if (err) {
                   console.log(err);
                   done( { 'error': 'dbErr'} );
               } else {
                   console.log("Fetched result !!");
                //    analyticsDbObj.close();
                   done(result);
               }
            })
  }, // end of function getCurrentGameStat

  getAnsStat: function(userId, gameId, responseType, done) {
    userAnalytics.aggregate(
            [
                 { $match:
                    {
                        'userId': userId,
                        'tournamentId':'null',
						'gameId': gameId,
						'responseType': responseType
                    }
                 },
                 { $group:
                     {
                         _id:  "$topicId" ,
						  responseTime: {$sum: "$responseTime"}
                     }
                 },
                 { $project:
                     {
                         _id : 0,
                         "topicId" : "$_id",
                         "responseTime" : "$responseTime"
                     }

                 }
            ],function(err, result){
                if (err) {
                   console.log(err);
                   done( { 'error': 'dbErr'} );
               } else {
                   console.log("Fetched result !!");
                   done(result);
               }
            }
    );
  },

  getAnsStatForUser: function(userId, gameId, responseType, done) {
    userAnalytics.aggregate(
            [
                 { $match:
                    {
                        'userId': userId,
                        'tournamentId':'null',
						'gameId': gameId,
						'responseType': responseType
                    }
                 },
                //  { $group:
                //      {
                //          _id:  "$topicId" ,
				// 		  responseTime: {$sum: "$responseTime"}
                //      }
                //  },
                 { $project:
                     {
                         _id : 0,
                         "topicId" : "$topicId",
                         "questionNumber" : "$questionNumber",
                         "responseTime" : "$responseTime",
                         "responseType" :"$responseType"

                     }

                 }
            ],function(err, result){
                if (err) {
                   console.log(err);
                   done( { 'error': 'dbErr'} );
               } else {
                   console.log("Fetched result !!");
                   done(result);
               }
            }
    );
  },
  // get data for a user , game wise data representing number of right and wrong
  // answer.
    getUserStatForAllGames: function(userId, done) {
        userAnalytics.aggregate(
            [
                 { $match:
                    {
                        'userId': userId
                        // 'tournamentId':'null'
                    }
                 },
                 { $group:
                     {
                         _id:  "$topicId" ,
						  correctCount: {$sum: { "$cond": [{ "$eq": [ "$responseType", 'correct' ] }, 1, 0 ] }},
						  wrongCount: {$sum: { "$cond": [{ "$eq": [ "$responseType", 'wrong' ] }, 1, 0 ] }},
                          skipCount: {$sum: { "$cond": [{ "$eq": [ "$responseType", 'skip' ] }, 1, 0 ] }}
                     }
                 },
                 { "$project": {
                     _id : 0, //excludes the _id field
                     "topicId" : "$_id",
                      "correctCount": "$correctCount",
                      "wrongCount" : "$wrongCount",
                      "skipCount": "$skipCount"
                     }
                 }
            ],
            function (err, result) {
                if (err) {
                   console.log(err);
                   done( { 'error': 'dbErr'} );
               } else {
                   console.log("Fetched result !!");
                   done(result);
               }
            }
        );
    },

    //  Get win count ascending for all the user presnt in db
    getAllUsersWinStat: function(done) {
        Profile.find(
                        {} ,
                        {
                            _id : 0,
                            userId : 1,
                            wins : 1
                        },
                        function (err, result) {
                            if (err) {
                               console.log(err);
                               done( { 'error': 'dbErr'} );
                           } else {
                               console.log("Fetched resultWW !!");
                               done(result);
                           }
                        }
                    ).sort({ wins : -1 });  // sort ascending
    }


};
