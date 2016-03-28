var userAnalyticsSchema=require('../models/userAnalytics'),
    analyticsDbObj = require('./analyticsDbConObj'),
    questionAnalytics=require('../models/questionAnalytics'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema),
    util = require('util');


// get overall points for all users
var o = {};
o.map = function () {
                       var key = this.userId;
                    //    var date = new Date(this.gameTime);
                    print ( 'val' );
                       var value =
                       {

                           opt: [this.selectedOptionId],
                           count : 1
                       };

                        emit(key, value);
                   }

o.reduce = function (key, values ) {
    var     retObj = {
        opt : [],
        count : 0
    };
    values.forEach(function(val){
        // print ( val );
        retObj.opt.push(val.opt[0]),
        retObj.count += 1
    });
    return retObj;

}


//
// o.finalize  = function (key, reducedValue) {
//
//                         };


o.query = { 'userId' : 'ch'}
// o.out = {replace:'testMapReduceOutput'}

userAnalytics.mapReduce(o, function (err, results) {
  // console.log(results);
  console.log(util.inspect(results));
  console.log(results[0]["value"]);
   analyticsDbObj.close();
});
