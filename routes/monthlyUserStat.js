var userAnalyticsSchema=require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    questionAnalytics=require('../models/questionAnalytics'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema),
    util = require('util');


// get overall points for all users
var o = {};
o.map = function () {
                       var k1 = this.userId;
                       var day =   this.gameTime.getMonth() + 1;
                       var key = {
                           'userId' : k1
                        //    'month' : day
                       };
                       var value =
                       {

                        //    opt: [this.gameTime],
                           gameMonth: day,
                           gameId : this.gameId,
                           count : 1
                       };
                        emit(key, value);
                   }


    var uniq = function(arr){
       var o = {}, i, l = arr.length, r = [];
       for(i=0; i<l;i+=1) o[arr[i]] = arr[i];
       for(i in o) r.push(o[i]);
       console.log()
       return r;
    }

// var arr = [1,3,3,3,4,4];
// console.log(uniq(arr));

o.reduce = function (key, values ) {
    var retObj = {
        gameMonth : [],
        gameIdArr : [],
        count : 0
    };
    var uniq = function(arr){
       var o = {}, i, l = arr.length, r = [];
       for(i=0; i<l;i+=1) o[arr[i]] = arr[i];
       for(i in o) r.push(o[i]);
       return r;
    }
    // values.forEach(function(val){
    //     // print ( val );
    //     retObj.opt.push(val.opt[0]),
    //     retObj.count += 1
    // });

    var tempGameMonth = [], tempGameIdArr = [];
    values.forEach(function(val){
       retObj.count  += val.count;
        tempGameMonth.push(val.gameMonth);
        tempGameIdArr.push(val.gameId);
    });
    var arr = uniq(retObj.gameIdArr);

    retObj.gameMonth = uniq(tempGameMonth);
    retObj.gameIdArr = uniq(tempGameIdArr);
    return retObj;
}


//
// o.finalize  = function (key, reducedValue) {
//
//                         };


// o.query = { 'userId' : 'ch'}
// o.out = {merge:'testMapReduceOutput'}

userAnalytics.mapReduce(o, function (err, results) {
  // console.log(results);
  // console.log(util.inspect(results));
  console.log(results[0]['value']);
  console.log(results[1]['value']);
  console.log(results[2]['value']);
  // console.log(results);

   analyticsDbObj.close();
});
