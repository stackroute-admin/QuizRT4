var getGameStat = require('../../getGameStat');
var Q = require('q');

module.exports = {
    // 1:> get total win count for a user
    getNumOfWin :function(currentGameData, flag, done){
        getGameStat.getWinCountForUser([currentGameData.userId])
        .then(function(data) {
            done(null,data[0].wins);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // 2:> get number of consecutive win for a user
    getNumOfConsWin :function(currentGameData, flag, done){
        getGameStat.getUserNOfConsWin(currentGameData.userId)
        .then(function(data) {
            done(null,data.winCount);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // 3:> get average response time for correct answer
    avgResTimeCrct :function(currentGameData, flag, done){
        getGameStat.getUserAvgRespTime(currentGameData.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // 4:> get distinct topic played count
    getNumOfUniqueTopicPlayed: function(currentGameData, flag, done) {
        getGameStat.getTopicPlayedForUser(currentGameData.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // 5:> get number of games played by a user
    getNumOfGamePlayed:function(currentGameData, flag, done) {
        getGameStat.getUserGamePlayedCount(currentGameData.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // 6:> get monthly visit count for current month
    getUserLoginCount: function(currentGameData, flag, done) {
        getGameStat.getMonthlyVisitCount(currentGameData.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get count of correct answer in a given gameId for user
    getNumOfCrctResCount: function(currentGameData, flag, done) {
        getGameStat.getCurrentGameStat(currentGameData.userId,currentGameData.gameId,function(data) {
            if(data.length>0){
                done(data[0].correctCount);
            }
            else {
                done(0);
            }
        });
    },
    // number of win in a topic by user
    getNumOfWinForTopic: function(currentGameData, flag, done){
        getGameStat.getTopicPlayedCountForUser(currentGameData.userId,currentGameData.topicId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get consecutive win count
    getConsWinCount : function(currentGameData, flag, done){
        getGameStat.getConsWinCount(currentGameData.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get consecutive login
    getNOfConsLogin:function(currentGameData, flag, done){
        getGameStat.getNOfConsLogin(currentGameData.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get count of correct answer in a given gameId for user
    getAvgCrctResTime: function(currentGameData, flag, done) {
        getGameStat.getCurrentGameStatTime(currentGameData.userId,currentGameData.gameId,function(data) {
            done(null,data);
        });
    },
    // get average win coungt for  a user
    //
}
