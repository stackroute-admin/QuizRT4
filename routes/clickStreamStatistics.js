var userAnalytics=require('../models/userAnalytics'),
    userAnalyticsSave =  function(data,type){
    var isCorrect=data.ans=='correct'? true:false,
        analyticsObj=
        {
            'tournamentId': 'null',
            'userId': data.userId,
            'questionId': data.questionId,
            'topicId': data.topicId,
            'responseTime': 10 - Number(data.responseTime),
            'gameTime': new Date().toString(),
            'selectedOptionId': Number(data.selectedOption) + 1,
            'isCorrect': isCorrect
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
