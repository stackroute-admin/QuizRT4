// var userProfile = require('../models/profile');
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/quizRT3');
//


var userAnalyticsSchema=require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    questionAnalytics=require('../models/questionAnalytics'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema);


// get overall points for all users
var o = {};
o.map = function () {
                       var key = this.userId;
                       var value = {
                           responseTime : this.responseTime,
                           count :1,
                           isCorrect : this.isCorrect
                       }

                        emit(key, value);
                   }

o.reduce = function (key, values ) {
        // return vals = Array.sum(values);
        var reducedObject = {
                              userid: key,
                              totalResponseTime: 0,
                              numOfQuesAttempted:0,
                              avgResponseTime:0,
                              correctResponseCount:0,
                              wrongResponseCount:0,
                              correctPercentage:0,
                              wrongPercentage:0
                            };

        values.forEach( function(value) {
                              reducedObject.totalResponseTime += value.responseTime;
                              reducedObject.numOfQuesAttempted += value.count;
                              if ( value.isCorrect == true ){
                                  reducedObject.correctResponseCount += 1;
                              }
                              else {
                                  reducedObject.wrongResponseCount += 1;
                              }
                        }
                      );
        return reducedObject;

     }

o.finalize  = function (key, reducedValue) {

                               if (reducedValue.numOfQuesAttempted > 0){
                                   reducedValue.avgResponseTime = reducedValue.totalResponseTime / reducedValue.numOfQuesAttempted;
                                   reducedValue.correctPercentage = (reducedValue.correctResponseCount * 100)/reducedValue.numOfQuesAttempted;
                                   reducedValue.wrongPercentage = (reducedValue.wrongResponseCount * 100)/reducedValue.numOfQuesAttempted;
                               }

                               return reducedValue;
                            };


// o.query = { 'userId' : 'ch'}
// o.out = {replace:'testMapReduceOutput'}

userAnalytics.mapReduce(o, function (err, results) {
  console.log(results)
   analyticsDbObj.close();
});

// Output of above operation
// { _id: 'mz',
//   value:
//    { userid: 'mz',
//      totalResponseTime: 43,
//      count: 12,
//      avg_time: 3.5833333333333335 } } ]
