// file to  take intermediate game data and store in variables to
// perform badge calculation

var getGameStat = require('./getGameStat');
var PreserveGameData = function(){
    this.dataArr = [];
    this.userRankObj = {};
};

PreserveGameData.prototype.addVal = function(newData){
    this.dataArr.push(newData);
}
PreserveGameData.prototype.addUserRank = function(userId,rank) {
    this.userRankObj[userId] = rank + 1;
}

// defining a reset method for reseting the storage array
// so that every game will have game values in this temp storage
PreserveGameData.prototype.reset = function(newData){
    this.dataArr = [];
    console.log("Reset Done for preserveData!!");
}


PreserveGameData.prototype.show = function (){
    self = this;
    var retObj = {};
    self.dataArr.forEach(function(newData){
        // initialize if object doesn't exists
        if ( !(newData.userId in retObj)){
            retObj[newData.userId] = {};
            retObj[newData.userId].currentGameCorrectAnsCount = 0;
            retObj[newData.userId].totalResponseSpeedCorrectQues = 0;
            retObj[newData.userId].avgResponseSpeedCorrectQues = 0;
            retObj[newData.userId].currentScore = 0;
            retObj[newData.userId].topicId = null;
            retObj[newData.userId].topicName = null;
            retObj[newData.userId].tournamentId = null;
        }
        if (newData.ans == 'correct'){
            retObj[newData.userId].currentGameCorrectAnsCount += 1;
            self.currentGameCorrectAnsCount += 1;
            retObj[newData.userId].totalResponseSpeedCorrectQues += newData.responseTime;
            retObj[newData.userId].avgResponseSpeedCorrectQues=retObj[newData.userId].totalResponseSpeedCorrectQues/retObj[newData.userId].currentGameCorrectAnsCount;
        }
        if('tournamentId' in newData){
            retObj[newData.userId].tournamentId = newData.tournamentId;
        }
        // total current score is coming all the time no need to add up
        retObj[newData.userId].currentScore = newData.score;
        retObj[newData.userId].topicId = newData.topicId;
    });
    // var userIdArr = Object.keys(retObj);
    // console.log(userIdArr);
    // @TODO: comment below line when in production, to avoid overwrite
    // var userIdArr = ['ch','mz'];
    // call function to get data from db pass userIdArr to the function
    // sample output
    //   [ [ { correctCount: 27, topicId: 'T1', userId: 'mz' },
    //   { correctCount: 23, topicId: 'T1', userId: 'ch' } ],
    // [ { correctCount: 31, userId: 'mz' },
    //   { correctCount: 23, userId: 'ch' } ],
    // [ { wins: 11, userId: 'ch' }, { wins: 18, userId: 'mz' } ] ]
    // var a = self.getRequiredGameData(userIdArr);
    // console.log(a);
    return retObj
}

PreserveGameData.prototype.getRequiredGameData = function(userIdArr){
    var deferred = Q.defer();
    var resultArr = [];
    Q.all([
        getGameStat.getAnsStatForATopic(userIdArr, 'T1', 'correct'),
        getGameStat.getAllAnsStatForUser(userIdArr, 'correct'),
        getGameStat.getWinCountForUser(userIdArr)
        ]).spread(function(res1,res2,res3){
            resultArr.push(res1,res2,res3);
            console.log(resultArr);
            deferred.resolve(resultArr);
    });
    return deferred.promise;
}

PreserveGameData.prototype.getAnalysisData = function (){
    self = this;
    var retObj = {};
    self.dataArr.forEach(function(newData){
        // initialize if object doesn't exists
        if ( !(newData.userId in retObj)){
            retObj[newData.userId] = {};
            retObj[newData.userId].totalResponseTime = 0;
            retObj[newData.userId].totalResponseCount = 0;
            retObj[newData.userId].numOfQuesAttempted = 0;
            retObj[newData.userId].correctResponseCount = 0;
            retObj[newData.userId].wrongResponseCount = 0;
            retObj[newData.userId].skipResponseCount = 0;

            retObj[newData.userId].correctPercentage = 0;
            retObj[newData.userId].wrongPercentage = 0;
            retObj[newData.userId].skipPercentage = 0;
            // total totalResponseTime/numOfQuesAttempted
            retObj[newData.userId].avgResponseTime = 0;
        }
        if (newData.ans === 'correct'){
            retObj[newData.userId].correctResponseCount += 1;
            retObj[newData.userId].numOfQuesAttempted += 1;
            retObj[newData.userId].totalResponseCount += 1;
            retObj[newData.userId].totalResponseTime += newData.responseTime;
        }
        if (newData.ans === 'wrong'){
            retObj[newData.userId].wrongResponseCount += 1;
            retObj[newData.userId].numOfQuesAttempted += 1;
            retObj[newData.userId].totalResponseCount += 1;
            retObj[newData.userId].totalResponseTime += newData.responseTime;
        }
        if (newData.ans === 'skip'){
            retObj[newData.userId].skipResponseCount += 1;
            retObj[newData.userId].totalResponseCount += 1;
        }
    });

    for (var userId in retObj){
        if(retObj[userId].correctResponseCount!==0){
            retObj[userId].correctPercentage = (retObj[userId].totalResponseCount/retObj[userId].correctResponseCount)*100;
        }
        if(retObj[userId].wrongResponseCount!==0){
            retObj[userId].wrongPercentage = (retObj[userId].totalResponseCount/retObj[userId].wrongResponseCount)*100;
        }
        if (retObj[userId].skipResponseCount!==0){
            retObj[userId].skipPercentage = (retObj[userId].totalResponseCount/retObj[userId].skipResponseCount)*100;
        }
        retObj[userId].avgResponseTime = (retObj[userId].totalResponseTime/retObj[userId].numOfQuesAttempted);
        }
        return retObj;
}

PreserveGameData.prototype.getStreakData = function (userIdArr){
    var retObj = {},
        gameObj = this.show();
        self = this;
    userIdArr.forEach(function(userId) {
        var userStreakCurrentGame = {
            streakDates :[],
            gamePlayedCount:0,
            bestScore:0,
            bestRank:0,
            winCount:0
        }
        var date = new Date();
        var dateVal = date.getFullYear() + '-' + ("0" +     Number(date.getMonth()+1)).slice(-2) + '-'
            + date.getDate();
        var rank = self.userRankObj[userId];
        var winCount = 0;
        if(rank===1){
            winCount = 1
        }
        userStreakCurrentGame.streakDates = [dateVal];
        userStreakCurrentGame.gamePlayedCount = 1
        userStreakCurrentGame.bestScore = gameObj[userId].currentScore;
        userStreakCurrentGame.bestRank = rank;
        userStreakCurrentGame.winCount = winCount;
        retObj[userId] = userStreakCurrentGame;
    });
    return retObj;
}


module.exports = PreserveGameData;
