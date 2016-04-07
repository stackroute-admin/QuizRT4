// Module to fetch different analytics data from the analyticsDB

//  require model and db conf file to analytics db
var userAnalyticsSchema = require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema),
    userPointsSchema = require('../models/userPointsStat'),
    userMonthlyGameStatSchema =  require('../models/userMonthlyGameStat'),
    // game played and visit count has same schema with different collection
    userMonthlyGameStat = analyticsDbObj.model('usermonthlygameplayedstat', userMonthlyGameStatSchema);
    userMonthlyVisitStat = analyticsDbObj.model('usermonthlyvisitcountstats', userMonthlyGameStatSchema);
    mapReduceObjPoint = analyticsDbObj.model('userPointStat', userPointsSchema);
    Profile = require("../models/profile"),
    Q = require('q');

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
                               console.log("Fetched results !!");
                               done(result);
                           }
                       }
                   ).sort({ wins : -1 });  // sort ascending it sort alphabetically:(
    },


    getUserWinRank: function(userId) {
        var deferred = Q.defer();
        // get distict wins
        console.log(userId);
        Profile.distinct('wins',function(err, result){
            if (err) {
               console.log(err);
               deferred.resolve( { 'error': 'dbErr'} );
           } else {
                // check if returned result has more than one element
                if (result.length >= 2){
                    // sort result
                    sortedResult = result.sort(function (a, b) {
                        return  b - a;   //sort descending
                    });
                    // create an object to hold winCount as key and rank as value
                    var winRankObj = {};
                    var rank = 1;
                    sortedResult.forEach(function(a){
                        winRankObj[a]=rank;
                        rank += 1;
                    });
                    //   now find data for userId
                    Profile.find(
                                    {'userId' : userId},
                                    {_id:0,wins:1},
                                    function(error,res){
                                        if (error) {
                                           deferred.resolve( { 'error': 'dbErr11'} );
                                       } else {
                                        //    console.log("Rank is " + winRankObj[res[0].wins]);
                                            console.log(res);
                                            if( res.length >= 1 ){
                                                deferred.resolve({'label':'Total Wins','rank' : winRankObj[res[0].wins]});
                                            }
                                            else {
                                                deferred.resolve( { 'error': 'dbErrwe'} );
                                            }
                                       }
                                    }
                    );
                }
                else {
                    deferred.resolve( { 'label':'Total Wins','rank': 1} );
                }

            //    done(sortedResult);
           }

       });
       return deferred.promise;
   },
   // mapReduceObjPoint
   getUserPointsRank: function(userId){
       var deferred = Q.defer();
       // fetch sorted userId according to totalpoints
       mapReduceObjPoint.find({},{ _id:0,userId:1},
            function(err, results){
                if (err) {
                   console.log(err);
                   deferred.resolve( { 'error': 'dbErr'} );
               } else {
                //    console.log("Fetched results !!");
                   if ( results.length >= 1 ){
                       for ( i = 0; i < results.length; i+=1){
                        //    console.log(results[0]);
                           if (results[i].userId === userId){
                            //    console.log("Rank is " + Number(i+1));
                               deferred.resolve({'label':'Total Points','rank':Number(i+1)});
                               break;
                           }
                        }
                    }
                    else {
                        deferred.resolve( { 'error': 'dbErr'} );
                    }
                //    done(results );
                }
            }
        ).sort({ totalPoint : -1 });
        return deferred.promise;
    },

    getUserAvgRespTimeRank: function(userId){
        var deferred = Q.defer();
        // fetch sorted userId according to totalpoints
        mapReduceObjPoint.find({},{'avgResponseTime':1, _id:0,userId:1},
             function(err, results){
                 if (err) {
                    console.log(err);
                    deferred.resolve( { 'error': 'dbErr'} );
                } else {
                 //    console.log("Fetched results !!");
                    if ( results.length >= 1 ){
                        for ( i = 0; i < results.length; i+=1){
                         //    console.log(results[0]);
                            if (results[i].userId === userId){
                             //    console.log("Rank is " + Number(i+1));
                                deferred.resolve({'label':'Avg Response Time','rank':Number(i+1)});
                                break;
                            }
                         }
                     }
                     else {
                         deferred.resolve( { 'error': 'dbErr'} );
                     }
                 //    done(results );
                 }
             }
         ).sort({'avgResponseTime': 1}); //sort ascending
         return deferred.promise;
     },

     getUserCorrectPerRank: function(userId){
         var deferred = Q.defer();
         // fetch sorted userId according to totalpoints
         mapReduceObjPoint.find({},{'correctPercentage':1, _id:0,userId:1},
              function(err, results){
                  if (err) {
                     console.log(err);
                     deferred.resolve( { 'error': 'dbErr'} );
                 } else {
                  //    console.log("Fetched results !!");
                     if ( results.length >= 1 ){
                         for ( i = 0; i < results.length; i+=1){
                          //    console.log(results[0]);
                             if (results[i].userId === userId){
                              //    console.log("Rank is " + Number(i+1));
                                 deferred.resolve({'label':'Correctness Ratio','rank':Number(i+1)});
                                 break;
                             }
                          }
                      }
                      else {
                          deferred.resolve( { 'error': 'dbErr'} );
                      }
                  //    done(results );
                  }
              }
          ).sort({'correctPercentage': -1}); //sort ascending

          return deferred.promise;
    },


    // function to get monthly uniq games played by an user for a year
    //  "statType" here refers "visits"  or "gamePlayed"
    // out is : { March: 1, April: 3 }
    // in case of no matching data return value is { 'error': 'dbErrNoData'}
    getMonthlyGameStat: function(userId,year,statType){
        var deferred = Q.defer();
        // assign dbObj  value depending on data requirement
        var resLabel = "";

        if( statType === "visits" ){
            dbObj = userMonthlyVisitStat;
            resLabel = "Visit Count";
        }
        else if ( statType === "gamePlayed" ){
            var dbObj = userMonthlyGameStat;
            resLabel = "Game Played Count";
        }
        else {
            // wrong value received return
            deferred.resolve([ { 'error': 'wrongInputValue'} ]);
            return deferred.promise;
        }
        dbObj.find(
            { 'userId' : userId, 'years.yearVal' : year },
            { 'years.monthObj' : 1, _id : 0 },
             function(err, results){
                 if (err) {
                    console.log(err);
                    deferred.resolve([ { 'error': 'dbErr'}] );
                } else {
                 //    console.log("Fetched results !!");
                    if ( results.length >= 1 ){
                        var retArr = [];
                        results.forEach(function(doc){
                            doc.years.forEach(function(mObj){
                                mObj.monthObj.forEach(function(mVal){
                                    retArr.push(
                                        {
                                            'Month' : mVal.month
                                        }
                                    );
                                    retArr[retArr.length-1][resLabel]=mVal.count;
                                });
                            });
                        });
                        deferred.resolve( retArr );
                     }
                     else {
                         deferred.resolve([ { 'error': 'dbErrNoData'} ]);
                     }
                 //    done(results );
                 }
             }
         );
         return deferred.promise;
    }



};
