var counterEvaluator = require('./counterEvaluator');
var Counters=function () {}
Counters.prototype.getFunction = function (counter,data,flag) {
  switch (counter) {
      case 'nOfWin':
        return function (done) {
          counterEvaluator.getNumOfWin(data,flag, function(err,value) {
              if(err)
                console.error(err);
              console.log("type "+ (typeof value));
              done(null,value[0].wins+1);
          });
        };
      case 'nOfConsWin':
        return function(done) {
          counterEvaluator.getNumOfConsWin(data,flag, function(err,value) {
            if(err)
              console.error(err);
            done(null,value);
          });
        };
      case 'avgResTimeCrctCurrentGame':
        return function(done) {
          counterEvaluator.getAvgResTimeCrctCurrentGame(data,flag, function(err,value) {
            if(err)
              console.error(err);
            done(null,value);
          });
        };
      case 'consLogin':
        return function(done) {
          counterEvaluator.getUserLoginCount(data,flag, function(err,value) {
            if(err)
              console.error(err);
            done(null,value);
          });
        };
      case 'nOfUniqTopicPlayed':
        return function(done) {
          counterEvaluator.getNumOfUniqueTopicPlayed(data,flag, function(err,value) {
            if(err)
              console.error(err);
            done(null,value);
          });
        };
      case 'nOfGamePlayed':
        return function(done) {
          counterEvaluator.getNumOfGamePlayed(data,flag, function(err,value) {
            if(err)
              console.error(err);
            done(null,value);
          });
        };
      case 'nOfCrctResCurGame':
        return function(done) {
          counterEvaluator.getNumOfCrctResCount(data,flag, function(err,value) {
            if(err)
              console.error(err);
            done(null,value);
          });
        };
      case 'nOfWinForATopic':
        return function(done) {
          counterEvaluator.getNumOfWinForTopic(data,flag, function(err,value) {
            if(err)
              console.error(err);
            done(null,value);
          });
        };
  }
};
module.exports = Counters;
