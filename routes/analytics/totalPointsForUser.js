var userProfile = require('../../models/profile');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizRT3');

// get overall points for all users across different topics and tournaments

var o = {};
o.map = function () {
                    //    var key = this.userId;
                       var key = {
                           'userId' : this.userId,
                           'timeStamp': new Date().toString()
                       };
                       // get level points
                       for (var idx = 0; idx < this.tournaments.length; idx++) {
                           var value = 0;
                            this.tournaments[idx].levelPoints.forEach(function(levelPoint){
                                value += levelPoint
                            })
                             emit(key, value);
                       }
                       // get points for topics played
                       for (var idx = 0; idx < this.topicsPlayed.length; idx++) {
                            var value = this.topicsPlayed[idx].points;
                            emit(key, value);
                       }
                   }




o.reduce = function (key, values ) {
        return vals = Array.sum(values);
     }
// o.sort = { points: -1 }

// o.query = { 'userId' : 'ch'}
// o.out = {replace:'testMapReduceOutput22'}

userProfile.mapReduce(o, function (err, results) {
  // console.log(results)


  var storeData = require('./storeMapReduceAnalysis');
  results.forEach(function(newRec){
      var combinedDataObj = newRec._id;
      combinedDataObj.totalPoint = newRec.value;
      storeData.saveMapReduceUserPoints(combinedDataObj,function(data) {
          console.log(data);
      });
  });


  // mongoose.disconnect();
});
