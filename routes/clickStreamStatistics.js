var userAnalyticsSchema=require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    questionAnalytics=require('../models/questionAnalytics'),

    userAnalyticsSave =  function(data,type){
    var userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema);
    var isCorrect = data.ans == 'correct' ? true : false,
        analyticsObj =
        {
            'tournamentId': 'null',
            'userId': data.userId,
            'gameId': data.gameId,
            'questionId': data.questionId,
            'topicId': data.topicId,
            'responseTime': 10 - Number(data.responseTime),
            'gameTime': data.gameTime,
            'selectedOptionId': Number(data.selectedOption) + 1,
            'isCorrect': isCorrect,
            'totalQuestionCount' : data.questionCount
        };

    if(type=='tournament') {
        analyticsObj.tournamentId=data.tournamentId;
    }
    new userAnalytics(analyticsObj).save(function(err,storeData){
        if(err){
            console.error(err);
        }
        else{
            console.log('addedd successfully');
        }
    });

}
module.exports = userAnalyticsSave;
