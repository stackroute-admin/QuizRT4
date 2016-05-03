var getGameStat = require('../../getGameStat');
var Q = require('q');

module.exports = {
    // get total win count for a user
    getNumOfWin :function(userId,done){
        getGameStat.getWinCountForUser([userId])
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get number of consecutive win for a user
    getNumOfConsWin :function(userId,done){
        getGameStat.getUserNOfConsWin(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // get average response time for correct answer
    avgResTimeCrct :function(userId,done){
        getGameStat.getUserAvgRespTime(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // get distinct topic played count
    getNumOfUniqueTopicPlayed: function(userId, done) {
        getGameStat.getTopicPlayedForUser(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get number of games played by a user
    getNumOfGamePlayed:function(userId,done) {
        getGameStat.getUserGamePlayedCount(userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get monthly visit count for current month
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
