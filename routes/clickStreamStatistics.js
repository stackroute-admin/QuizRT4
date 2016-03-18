var userAnalytics=require('../models/userAnalytics'),
    questionAnalytics=require('../models/questionAnalytics'),
    userAnalyticsSave =  function(data,type){
    var isCorrect = data.ans == 'correct' ? true : false,
        analyticsObj =
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


        // creating object for question analytics
        var currectCount = 0,
            wrongCount = 0,
            incrValue = {};
        if (isCorrect){
            currectCount = 1;
            incrValue = { $inc : { "stats.qAnsweredCorrectCount" : 1 , "stats.qAskedCount" : 1 } };
        }
        else {
            wrongCount=1;
            incrValue = { $inc : { "stats.qAnsweredWrongCount" : 1, "stats.qAskedCount" : 1 } };
        }

        var qAnalyticsObj = {
            'questionId': data.questionId,
            'stats' : {
                'qAskedCount' : 1,
                'qAnsweredCorrectCount': currectCount,
                'qAnsweredWrongCount': wrongCount
            }
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

    questionAnalytics.findOneAndUpdate({questionId: data.questionId}, incrValue,  function(err, doc){
        if(err){
            console.log("Something wrong when updating question stats!");
        }
        if ( doc == null){
            console.log("No record found for  questionId" + data.questionId);
            new questionAnalytics(qAnalyticsObj).save(function (err, storeData) {
              if (err) return console.error(err);
              console.log("Added question stats");
            });
        }
        // console.log(doc);
    });
}
module.exports = userAnalyticsSave;
