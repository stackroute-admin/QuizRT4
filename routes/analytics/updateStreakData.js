var moment = require('moment');
var analyticsDbObj = require('.././analyticsDbConObj'),
    userPointsSchema = require('../../models/userPointsStat'),
    pointAndStreakObj = analyticsDbObj.model('userPointStat', userPointsSchema);

var updateStreakData = function(gameData){
    // takeout userIdArr
    var userIdArr = Object.keys(gameData);
    pointAndStreakObj.find(
        {'userId':{ $in: userIdArr } },
        {userStreak:1,userStreakCurrent:1,userId:1},
        function(err,record) {
            if(err) console.log(err);
            var count = 0;
            record.forEach(function(rec) {
                var userStreakCurrent;
                var newData = gameData[rec.userId];
                if(rec.userStreakCurrent.streakDates.length!==0){
                    userStreakCurrent = createCurrentStreak(rec.userStreakCurrent,newData);
                    console.log(userStreakCurrent);
                }
                else {
                    console.log(newData);
                    userStreakCurrent = newData;
                }
                rec.userStreakCurrent = userStreakCurrent;
                // now check if 'userStreak' has any value already or not
                if ( rec.userStreak.streakDates.length === 0 || rec.userStreak.streakDates.length <= userStreakCurrent.streakDates.length){
                    rec.userStreak = userStreakCurrent;
                }
                rec.save(function(err){
                    count+=1;
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Record Updated!");
                    }
                    if(count===record.length){
                        done();
                    }
                });
            });
        }
    );
}

var done = function(err,data) {
    // comment below line when in production
    // analyticsDbObj.close()
    console.log("Done updating streak data");
}
var createCurrentStreak = function(oldData, newData){
    var oldStreakDates = oldData.streakDates,
        //it will always have only one elememnt
        newStreakDate = newData.streakDates[0],
        dateVal = moment(oldStreakDates,"YYYY-MM-DD"),
        oldNextDate = dateVal.add(1, 'days');
        oldNextDate = oldNextDate.format('YYYY-MM-DD');
    // check if old streakDates array has some data
    if(oldStreakDates.length !== 0){
        var latestDate = oldStreakDates[oldStreakDates.length-1]; //last element is the latest date
        // check if the lastest date is same as newStreakDate
        if( latestDate === newStreakDate ){
            // add up all the values
            oldData.gamePlayedCount += newData.gamePlayedCount;
            if(oldData.bestScore < newData.bestScore){
                oldData.bestScore = newData.bestScore;
            }
            if (oldData.bestRank > newData.bestRank) {
                oldData.bestRank = newData.bestRank;
            }
            oldData.winCount += newData.winCount;
        }
        // check if lastest date is previous date of newStreakDate
        // in this case add new date to the array and increment
        // other values
        else if(oldNextDate === newStreakDate){
            oldData.streakDates.push(newStreakDate);
            oldData.gamePlayedCount += newData.gamePlayedCount;
            if(oldData.bestScore < newData.bestScore){
                oldData.bestScore = newData.bestScore;
            }
            if (oldData.bestRank > newData.bestRank) {
                oldData.bestRank = newData.bestRank;
            }
            oldData.winCount += newData.winCount;
        }
        else {
            // assign new values to the oldData
            oldData = newData;
        }
    }
    else {
        oldData = newData;
    }
    return oldData;
}

// gameData= {
//      ch:
//          { streakDates: [ '2016-04-30' ],
//          gamePlayedCount: 1,
//          bestScore: 3,
//          bestRank: 2,
//          winCount: 0 },
//   mz:
//    { streakDates: [ '2016-04-30' ],
//      gamePlayedCount: 1,
//      bestScore: 3,
//      bestRank: 1,
//      winCount: 1 }
//  }

// updateStreakData(gameData);

module.exports = updateStreakData;
