// This file is written to apply Map Reduce Operation on the raw User data
// captured during game, this file reads user data from "useranalytics" collection
// present in analyticsDB
// it updates the output of the MR (Map Reduce) function to the "usermonthlygameplayedstats"
// collection.

var userAnalyticsSchema=require('../../models/userAnalytics'),
    analyticsDbObj = require('.././analyticsDbConObj'),
    userAnalytics = analyticsDbObj.model('userAnalytics', userAnalyticsSchema);

var o = {};

o.map = function () {
            monthNames = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
                       var month =   monthNames[this.gameTime.getMonth()];
                    //    take userId and timeStamp as key
                       var key = {
                           'userId' : this.userId,
                           'timeStamp': new Date().toString()
                       };
                    //    Count gameId played during a month
                       var value =
                       {
                           years :
                           [
                               {
                                   yearVal : this.gameTime.getFullYear(),
                                   yearlyCount : 1,
                                   monthObj : [
                                       {
                                           month:month,
                                           gameId : this.gameId,
                                           count:1
                                       }
                                    ]
                                }
                            ]
                        };
                        emit(key, value);
                   }

o.reduce = function (key, values ) {
    // function to find out uniq array values
    var uniq = function(arr){
       var o = {}, i, l = arr.length, r = [];
       for(i=0; i<l;i+=1) o[arr[i]] = arr[i];
       for(i in o) r.push(o[i]);
       return r;
    }
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
                    // store all gameId in this array
                    monthCountObj[obj.month] = [obj.gameId];
                }

                else{
                    monthCountObj[obj.month].push(obj.gameId);
                }
            });
        }

    });

    for (var k in monthCountObj){
        // find uniq gameId for a user
        var uniqArr = uniq(monthCountObj[k]);
        retObj.years[0].monthObj.push({
            month : k,
            count : uniqArr.length  //number of different game is game played count
        });
        retObj.years[0].yearlyCount +=  uniqArr.length;
    }
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
  console.log("Done with Map Reduce Operation!");
  // Now pass MR analysed data to function which checks existing data
  // and adds to that, so that data doesn't get overridden every time 
  // but it gets updated with the new data.
  var storeData = require('./storeMapReduceAnalysis');
  results.forEach(function(newRec){
      var combinedDataObj = newRec._id;
      combinedDataObj.years = newRec.value.years;
      storeData.getMapReduceData(combinedDataObj,function(data) {
          console.log(data);
      });
  });

});
