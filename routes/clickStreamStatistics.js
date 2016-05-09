var userAnalyticsSchema = require('../models/userAnalytics'),
    userLoginStatSchema = require('../models/userLoginStat'),
    analyticsDbObj = require('./analyticsDbConObj'),
    questionAnalytics=require('../models/questionAnalytics');

var userAnalyticsSave =  function(data,type){
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
            'questionNumber': data.questionNumber,
            'responseType': data.ans,
            'insertTime' : new Date().toString()
        };

    if(type == 'tournament') {
        analyticsObj.tournamentId=data.tournamentId;
    }
    new userAnalytics(analyticsObj).save(function(err,storeData){
        if(err){
            console.error(err);
        }
        else{
            console.log('clickStream data added successfully');
        }
    });
};

// Function to add user login data to db
var userLoginStatSave = function(data){
    var userLoginStat = analyticsDbObj.model('userLoginStat', userLoginStatSchema),
        userLoginDataObj = {
            userId : data.userId,
            loginTime : data.loginTime
        };

    new userLoginStat(userLoginDataObj).save(function(err,storeData){
        if(err){
            console.error(err);
        }
        else{
            console.log('addedd successfully');
        }
    });
};
module.exports = {userAnalyticsSave,userLoginStatSave};
