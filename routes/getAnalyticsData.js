var userAnalytics=require('../models/userAnalytics'),
    questionAnalytics=require('../models/questionAnalytics'),
    // here tournamentId shall be "null" in case of normal game and
    // shall be a valid tournamentId in case of tournament
    getUserAnalyticsForGame = function(userId, topicId,tournamentId){
        userAnalytics.aggregate(
            [
                 { $match:
                    {
                        'userId': userId,
                        'topicId':topicId,
                        'tournamentId':tournamentId
                    }
                 },
                 { $group:
                     {
                         _id: "$responseType",
                         total: { $sum: "$responseTime" }
                     }
                 },
                 { $sort: { total: -1 } }
            ],
                function (err, userData) {
                    resObj = {};
                    if (err){
                        console.log("Error while fetching"+ userId + " analytics data for game" +gameId );
                    }
                    else {
                        // console.log(userData);
                        console.log("I am here fetching data");
                        userData.forEach(function(res){
                            if ( res._id === 'correct' ){
                                { resObj['correctAns'] = res.total };
                            }
                            else if(res._id === 'wrong') {
                                { resObj['wrongAns'] = res.total };
                            }

                        });
                        console.log(resObj);
                    }
                });
    };

module.exports = getUserAnalyticsForGame;
