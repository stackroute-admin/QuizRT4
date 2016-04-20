// file to  take intermediate game data and store in variables to
// perform badge calculation

var getGameStat = require('./getGameStat');
var PreserveGameData = function(){
    this.dataArr = [];
};

PreserveGameData.prototype.addVal = function(newData){
    this.dataArr.push(newData);
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
    var userIdArr = Object.keys(retObj);
    // console.log(userIdArr);
    // @TODO: comment below line when in production, to avoid overwrite
    var userIdArr = ['ch','mz'];
    // call function to get data from db pass userIdArr to the function
    // sample output
    //   [ [ { correctCount: 27, topicId: 'T1', userId: 'mz' },
    //   { correctCount: 23, topicId: 'T1', userId: 'ch' } ],
    // [ { correctCount: 31, userId: 'mz' },
    //   { correctCount: 23, userId: 'ch' } ],
    // [ { wins: 11, userId: 'ch' }, { wins: 18, userId: 'mz' } ] ]
    var a = self.getRequiredGameData(userIdArr);
    console.log(a);
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



module.exports = PreserveGameData;
