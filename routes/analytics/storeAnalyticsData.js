var storeData = require('./storeMapReduceAnalysis'),
    userData = require('./createMonthlyUserData'),
    updateStreakData = require('./updateStreakData');


var storeAnalyticsData = function( gameData, gamePlayerObj, done ) {
    var pAnalysisDataObj = gameData.preserveObj.getAnalysisData();
    var userIdArr = [];
    var resolvedCallabackCounter = 0;
    gamePlayerObj.forEach(function(userObj) {
        userIdArr.push(userObj.userId);
        var userDataObj = userData.createMonthlyUserData(userObj.userId);
        storeData.getMapReduceData(userDataObj,function(data) {
           var tempData = pAnalysisDataObj[userObj.userId];
           if ( typeof tempData != "undefined"){
               tempData.userId = userObj.userId;
               storeData.saveMRUserRespTimeStat(tempData,function(data) {
                   resolvedCallabackCounter += 1;
                   if (resolvedCallabackCounter == gamePlayerObj.length){
                       updateStreakData(gameData.preserveObj.getStreakData(userIdArr),function() {
                           gameData.preserveObj.reset();
                           done();
                       });
                   }
               });
           }
           else {
               resolvedCallabackCounter += 1;
               if (resolvedCallabackCounter == gamePlayerObj.length){
                   done();
               }
           }
        });
    });
}


module.exports = storeAnalyticsData;
