var counterEvaluator = require('./counterEvaluator');
var Counters=function () {}
Counters.prototype.getFunction = function (counter,data,flag) {
  switch (counter) {
      case 'nOfWin':
        return counterEvaluator.getNumOfWin(data,flag);
      case 'nOfConsWin':
        return counterEvaluator.getNumOfConsWin(data,flag);
      case 'avgResTimeCrctCurrentGame':
        return counterEvaluator.getAvgResTimeCrctCurrentGame(data,flag);
      case 'consLogin':
        return counterEvaluator.getUserLoginCount(data,flag);
      case 'nOfUniqTopicPlayed':
        return counterEvaluator.getNumOfUniqueTopicPlayed(data,flag);
      case 'nOfGamePlayed':
        return counterEvaluator.getNumOfGamePlayed(data,flag);
      case 'nOfCrctResCurGame':
        return counterEvaluator.getNumOfCrctResCount(data,flag);
      case 'nOfWinForATopic':
        return counterEvaluator.getNumOfWinForTopic(data,flag);
  }
};
module.exports = Counters;
