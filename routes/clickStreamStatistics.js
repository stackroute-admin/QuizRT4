var userAnalyticsSchema=require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    questionAnalytics=require('../models/questionAnalytics'),

    userAnalyticsSave =  function(data,type){
    var userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema),
        responseTime = data.responseTime === null ? null : 10 - Number(data.responseTime),
        selectedOptionId = data.selectedOption === null ? null : Number(data.selectedOption) + 1;

        analyticsObj =
        {
            'tournamentId': 'null',
            'userId': data.userId,
            'gameId': data.gameId,
            'questionId': data.questionId,
            'topicId': data.topicId,
            'responseTime': responseTime,
            'gameTime': data.gameTime,
            'selectedOptionId': selectedOptionId,
            'responseType': data.ans
        };

    if(type == 'tournament') {
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
