var getGameStat = require('../../getGameStat');
var Q = require('q');

module.exports = {
    // 1:> get total win count for a user
    getNumOfWin :function(userId,done){
        getGameStat.getWinCountForUser([userId])
        .then(function(data) {
            done(null,data[0].wins);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // 2:> get number of consecutive win for a user
    getNumOfConsWin :function(userId,done){
        getGameStat.getUserNOfConsWin(userId)
        .then(function(data) {
            done(null,data.winCount);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // 3:> get average response time for correct answer
    avgResTimeCrct :function(userId,done){
        getGameStat.getUserAvgRespTime(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // 4:> get distinct topic played count
    getNumOfUniqueTopicPlayed: function(userId, done) {
        getGameStat.getTopicPlayedForUser(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // 5:> get number of games played by a user
    getNumOfGamePlayed:function(userId,done) {
        getGameStat.getUserGamePlayedCount(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // 6:> get monthly visit count for current month
    getUserLoginCount: function(userId,done) {
        getGameStat.getMonthlyVisitCount(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get count of correct answer in a given gameId for user
    getNumOfCrctResCount: function(userId,gameId,done) {
        getGameStat.getCurrentGameStat(userId,gameId,function(data) {
            if(data.length>0){
                done(data[0].correctCount);
            }
            else {
                done(0);
            }
        });
    },
    // mber of win in a topic by user
    getNumOfWinForTopic: function(userId,topicId,done){
        getGameStat.getTopicPlayedCountForUser(userId,topicId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    }
}


// getGameStat.getCurrentGameStat('mz','b39e1380-ffab-11e5-9529-53801e3bf90e',function (data) {
//     console.log(data);
// })

getGameStat.getTopicPlayedCountForUser('mddz','T2').then(function(data) {
    console.log(data);
})
