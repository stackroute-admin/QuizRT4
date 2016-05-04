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
    }
}
