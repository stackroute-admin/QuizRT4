var getGameStat = require('../../getGameStat');
var Q = require('q');

module.exports = {
    // get total win count for a user
    getNumOfWin :function(data,flag,done){
        getGameStat.getWinCountForUser([data.userId])
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get number of consecutive win for a user
    getNumOfConsWin :function(data,flag,done){
        getGameStat.getUserNOfConsWin(data.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // get average response time for correct answer
    avgResTimeCrct :function(data, flag,done){
        console.log(flag);
        getGameStat.getUserAvgRespTime(data.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },

    // get distinct topic played count
    getNumOfUniqueTopicPlayed: function(data, flag, done) {
        console.log(flag);
        getGameStat.getTopicPlayedForUser(data.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get number of games played by a user
    getNumOfGamePlayed:function(data,flag,done) {
        getGameStat.getUserGamePlayedCount(data.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get monthly visit count for current month
    getUserLoginCount: function(data,flag,done) {
        getGameStat.getMonthlyVisitCount(data.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get count of correct answer in a given gameId for user
    getNumOfCrctResCount: function(data,flag,done) {
        getGameStat.getCurrentGameStat(data.userId,data.gameId,function(data) {
            if(data.length>0){
                done(data[0].correctCount);
            }
            else {
                done(0);
            }
        });
    },
    // number of win in a topic by user
    getNumOfWinForTopic: function(data,flag,done){
        getGameStat.getTopicPlayedCountForUser(data.userId,data.topicId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get consecutive win count
    getConsWinCount : function(data,flag, done){
        getGameStat.getConsWinCount(data.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    },
    // get consecutive login
    getNOfConsLogin:function(data,flag,done){
        //console.log(flag);
        getGameStat.getNOfConsLogin(data.userId)
        .then(function(data) {
            done(null,data);
        })
        .fail(function(err) {
            done(err,null);
        });
    }
    //
}
