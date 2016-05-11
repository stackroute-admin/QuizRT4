var userProfile = require('../../models/profile');
var mongoose = require('mongoose');
var moment = require('moment');
mongoose.connect('mongodb://localhost/quizRT4');

// get overall points for all users across different topics and tournaments
// and store data in "userpointstats" collection present in "analyticsDB"

var o = {};
o.map = function () {
                    //    var key = this.userId;
                       var key = {
                           'userId' : this.userId,
                           'timeStamp': new Date().toString()
                       };
                       // get level points
                       var val = {
                           value :0,
                           gameInfo:[]
                       }
                       for (var idx = 0; idx < this.tournaments.length; idx++) {
                           val.value = 0;
                            this.tournaments[idx].levelPoints.forEach(function(levelPoint){
                                val.value += levelPoint
                            });
                             emit(key, val);
                       }
                       // get points for topics played
                       for (var idx = 0; idx < this.topicsPlayed.length; idx++) {
                            val.value = this.topicsPlayed[idx].points;
                            if ( this.topicsPlayed[idx].hasOwnProperty("gameInfo")){
                                val.gameInfo = this.topicsPlayed[idx].gameInfo;
                            }else {
                                val.gameInfo = [];
                            }
                            emit(key, val);
                       }
                   }
o.reduce = function (key, values ) {
        var retObj = {
            value:0,
            gameInfo:[]
        } ;
        var arr1 =[];
        values.forEach(function(vals){
            var dateStr,rank,score;
            arr1.push(vals.value);
            if( vals.gameInfo.length != 0 ){
                // retObj.gameInfo.push(vals.gameInfo);
                vals.gameInfo.forEach(function(data){
                    // retObj.gameInfo.push(data.gameDate.getFullYear());
                    // adding leading zero in one digit month value
                    dateStr = data.gameDate.getFullYear() + '-' +                                                      ("0" + Number(data.gameDate.getMonth()+1)).slice(-2) + '-'
                        + data.gameDate.getDate() ;
                    rank = data.rank;
                    score = data.score;
                    retObj.gameInfo.push({'dateStr': dateStr,
                                            'rank':rank,
                                            'score':score
                                        });
                    dateStr = null;
                    rank = null;
                    score = null;
                });
            }
        });
        retObj.value = Array.sum(arr1);
        return retObj;
     }
// o.sort = { points: -1 }

//o.query = { 'userId' : 'ch'}
// o.out = {replace:'testMapReduceOutput22'}

userProfile.mapReduce(o, function (err, results) {
  // console.log(results)
  // console.log(results[0].value.gameInfo);
  var storeData = require('./storeMapReduceAnalysis');
  results.forEach(function(newRec){
    dataObj = {};
    newRec.value.gameInfo.forEach(function(data){
        // check if the data has directly come from map function
        // here we are checking for "gameDate" as in map phase
        // we have this value but in reduce we are dropping this value.
        if( data.hasOwnProperty('gameDate') ){
            // we are here mean data did not reach to reducer function so
            // need to create dateStr so that we can do manupulation
            var dateStr = data.gameDate.getFullYear() + '-' +                                                      ("0" + Number(data.gameDate.getMonth()+1)).slice(-2) + '-'
                + data.gameDate.getDate() ;
            data.dateStr = dateStr;
        }
        if ( data.dateStr in dataObj ){
            // can give best score instead
            // dataObj[data.dateStr].score += data.score;
            if (dataObj[data.dateStr].bestScore < data.score){
                dataObj[data.dateStr].bestScore = data.score;
            }

            dataObj[data.dateStr].gamePlayedCount += 1;
            if (dataObj[data.dateStr].bestRank > data.rank){
                dataObj[data.dateStr].bestRank = data.rank;
            }
            if ( data.rank === 1 ){
                dataObj[data.dateStr].winCount += 1;
            }
        }
        else {

            dataObj[data.dateStr] = {};
            // dataObj[data.dateStr].score = data.score;
            dataObj[data.dateStr].bestScore = data.score;
            dataObj[data.dateStr].gamePlayedCount = 1;
            dataObj[data.dateStr].bestRank = data.rank;
            if ( data.rank === 1 ){
                dataObj[data.dateStr].winCount = 1;
            }
            else {
                dataObj[data.dateStr].winCount = 0;
            }
        }
    });
    // do streak calculation here
    var finalStreak = {
        streakDates :[],
        gamePlayedCount:0,
        bestScore:0,
        bestRank:0,
        winCount:0
    };
    var tempStreak = {
        streakDates :[],
        gamePlayedCount:0,
        bestScore:0,
        bestRank:0,
        winCount:0
    };
    var nextDate,currentDate;
    var i = 0;
     for ( k in dataObj ){

         currentDate = k;
         if ( i === 0){
             tempStreak.streakDates.push(currentDate);
             tempStreak.gamePlayedCount += dataObj[k].gamePlayedCount;
             tempStreak.bestScore = dataObj[k].bestScore;
             tempStreak.bestRank = dataObj[k].bestRank;
             tempStreak.winCount = dataObj[k].winCount;
         }
         if ( currentDate == nextDate ){
             tempStreak.streakDates.push(currentDate);
             tempStreak.gamePlayedCount += dataObj[k].gamePlayedCount;
             tempStreak.bestScore = dataObj[k].bestScore;
             tempStreak.bestRank = dataObj[k].bestRank;
             tempStreak.winCount = dataObj[k].winCount;
         }
         else {
             if ( tempStreak.streakDates.length >= finalStreak.streakDates.length ){
                 finalStreak = tempStreak;
             }
             tempStreak = {
                 streakDates :[],
                 gamePlayedCount:0,
                 bestScore:0,
                 bestRank:0,
                 winCount:0
             };
            tempStreak.streakDates.push(currentDate);
            tempStreak.gamePlayedCount += dataObj[k].gamePlayedCount;
            tempStreak.bestScore = dataObj[k].bestScore;
            tempStreak.bestRank = dataObj[k].bestRank;
            tempStreak.winCount = dataObj[k].winCount;
         }
         var dateVal = moment(currentDate,"YYYY-MM-DD");
         nextDate = dateVal.add(1, 'days');
         nextDate = nextDate.format('YYYY-MM-DD');
         i++;
     }
     if ( tempStreak.streakDates.length >= finalStreak.streakDates.length ){
         finalStreak = tempStreak;
     }
        var combinedDataObj = newRec._id;
        combinedDataObj.totalPoint = newRec.value.value;
        combinedDataObj.userStreak = finalStreak;
        storeData.saveMapReduceUserPoints(combinedDataObj,function(data) {
            console.log("Done storing streak data");
        });
  });

  // var storeData = require('./storeMapReduceAnalysis');
  // results.forEach(function(newRec){
  //     var combinedDataObj = newRec._id;
  //     combinedDataObj.totalPoint = newRec.value;
  //     storeData.saveMapReduceUserPoints(combinedDataObj,function(data) {
  //         console.log(data);
  //     });
  // });


  // mongoose.disconnect();
});
