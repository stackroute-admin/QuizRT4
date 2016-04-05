//  Map Reduce function to calculate  monthly user visit count for users
// and store in a collection.
// it uses "userLoginStat" collection to analyse row data and stores them
// in new collection "userMonthlyVisitCountStat"
//  storage part of functionality come from "storeMapReduceAnalysis" file.

var userAnalyticsSchema=require('../../models/userLoginStat'),
    analyticsDbObj = require('.././analyticsDbConObj'),
    userLoginStat = analyticsDbObj.model('userLoginStat', userAnalyticsSchema);

var o = {};

o.map = function () {
            monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
                       var month =   monthNames[this.loginTime.getMonth()];
                       var key = {
                           'userId' : this.userId,
                           'timeStamp': new Date().toString()
                       };
                       var value =
                       {
                           years :
                           [
                               {
                                   yearVal : this.loginTime.getFullYear(),
                                   yearlyCount : 1,
                                   monthObj : [
                                       {
                                           month:month,
                                           count:1
                                       }
                                    ]
                                }
                            ]
                        };
                        emit(key, value);
                   }

o.reduce = function (key, values ) {
    var retObj = {
        years :
        [
            {
                yearVal : undefined,
                yearlyCount : 0,
                monthObj : []
            }
        ]
    };

    var monthCountObj = {};
    values.forEach(function(vals){
        for ( i = 0; i < vals.years.length; i++){
            retObj.years[i].yearVal = vals.years[i].yearVal;

            vals.years[i].monthObj.forEach(function(obj){
                if ( !(obj.month in monthCountObj) ){
                    // Initialize count value with 1
                    monthCountObj[obj.month] = 1;
                }
                else{
                    // increment count
                    monthCountObj[obj.month] += 1;
                }
            });
        }

    });

    for (var k in monthCountObj){
        retObj.years[0].monthObj.push({
            month : k,
            count : monthCountObj[k]  //number of different game is game played count
        });
        retObj.years[0].yearlyCount +=  monthCountObj[k];
    }

    return retObj;
}

//
// o.finalize  = function (key, reducedValue) {
//
//                         };


// o.query = { 'userId' : 'ch'}
// o.out = {replace:'testMapReduceOutput'}

userLoginStat.mapReduce(o, function (err, results) {
    console.log("Done");
   // console.log(results[1].value.years[0].monthObj);
  // console.log("Done with Map Reduce Operation!");
  var storeData = require('./storeMapReduceAnalysis');
  results.forEach(function(newRec){
      var combinedDataObj = newRec._id;
      combinedDataObj.years = newRec.value.years;
      storeData.saveMapReduceVisitCount(combinedDataObj,function(data) {
          console.log(data);
      });
  });

});
