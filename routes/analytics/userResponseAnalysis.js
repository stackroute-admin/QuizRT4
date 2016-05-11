// var userProfile = require('../models/profile');
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/quizRT4');
//


var userAnalyticsSchema=require('../../models/userAnalytics'),
    analyticsDbObj = require('./../analyticsDbConObj'),
    questionAnalytics=require('../../models/questionAnalytics'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema);


// get overall points for all users
var o = {};
o.map = function () {
                       var key = this.userId;
                       var value = {
                           responseTime : this.responseTime,
                           count :1,
                           responseType : this.responseType
                       }

                        emit(key, value);
                   }

o.reduce = function (key, values ) {
        // return vals = Array.sum(values);
        var reducedObject = {
                              userId: key,
                              totalResponseTime: 0,
                              numOfQuesAttempted:0,
                              avgResponseTime:0,
                              correctResponseCount:0,
                              wrongResponseCount:0,
                              skipResponseCount:0,
                              correctPercentage:0,
                              wrongPercentage:0,
                              skipPercentage:0,
                            };

        values.forEach( function(value) {
                               if(value.responseTime!=undefined){
                                   reducedObject.totalResponseTime += value.responseTime;
                               }
                               if(value.count!=undefined){
                                   reducedObject.numOfQuesAttempted += value.count;
                               }
                              if ( value.responseType == 'correct' ){
                                  reducedObject.correctResponseCount += 1;
                              }
                              else if ( value.responseType == 'wrong' ) {
                                  reducedObject.wrongResponseCount += 1;
                              }
                              else {
                                  reducedObject.skipResponseCount += 1;
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
                                   reducedValue.skipPercentage = (reducedValue.skipResponseCount * 100)/reducedValue.numOfQuesAttempted;
                               }
                               return reducedValue;
                            };


// o.query = { 'userId' : 'ch'}
// o.out = {replace:'testMapReduceOutput'}

userAnalytics.mapReduce(o, function (err, results) {
  // console.log(results);

    var storeData = require('./storeMapReduceAnalysis');
    results.forEach(function(newRec){
        var combinedDataObj = newRec.value;
        storeData.saveMRUserRespTimeStat(combinedDataObj,function(data) {
            // console.log(data);
        });
    });
   // analyticsDbObj.close();
});

// Output of above operation
// { _id: 'mz',
//   value:
//    { userid: 'mz',
//      totalResponseTime: 43,
//      count: 12,
//      avg_time: 3.5833333333333335 } } ]
