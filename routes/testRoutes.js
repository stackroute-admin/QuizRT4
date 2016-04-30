var test = require('./getGameStat');

// test.getCurrentGameStat('mz','fdb57ba0-f7ec-11e5-8346-ab2bed8e24f2',function(data){
//     // console.log("done");
//     console.log(data);
// });
// //
// test.getAnsStat('ch', 'e9ef09b0-f594-11e5-b686-897a16decc19', false, function(data){
//     console.log(data);
// }
// );

test.getAnsStatForATopic(['mz','ch'], 'T1', 'correct', function(data){
     console.log(data);
});




// test.getAllAnsStatForUser('mz', 'correct', function(data){
//      console.log(data);
// });


    test.getWinCountForUser(['ch','mz'], function(data){
     console.log(data);
});

//
// // getUserStatForAllGames
//
// test.getUserStatForAllGames('mz', function(data){
//     console.log(data);
// }
// );



// test.getAllUsersWinStat(function(data){
//     console.log('wsdfgvb');
//     console.log(data);
// }
// );
//
// test.getAnsStatForUser('ch', 'e66ea670-f80e-11e5-ab4c-6b9f368b52c1', 'wrong', function(data){
//     console.log('wsdfgvb');
//     console.log(data);
// });


// getAnsStatForUser: function(userId, gameId, responseType, done)

// var ab = {
//     userId: "Lolwa",
//     timeStamp: new Date().toString(),
//     years :[
//             {
//             yearVal : 2016,
//             yearlyCount: 8,
//             monthObj : [
//                 {
//                     month : "April",
//                     count : 8
//                 }
//             ]
//         }
//     ]
// };
// test.getMapReduceData(ab,function(data) {
//     console.log(data);
// });

//
// test.getUserWinRank('ch',function(data){
//     console.log(data);
// }
// );

var Q = require('q');

// visits gamePlayed
// test.getMonthlyGameStat('ch','2016','gamePlayed').then(function(retArr){
//     console.log(retArr);
//
//
//
//
// })
// test.getUserPointsRankAndStreak('chkfff').then(function(data){
// console.log(data);
//
// })

// test.getUserAvgRespTimeRank('ch').then(function(data){
// console.log(data);
//
// })
// // getUserPointsRank()
//
// Q.all([
//     test.getUserWinRank('ch'),
//     test.getUserPointsRank('ch')
//
// ]).spread(function(res1,res2){
//     console.log(res1 ,res2);
// });


//
// test.getUserPointsRank('ch',function(data){
//     console.log(data);
// });
//
//
// test.getUserPointsRankAndStreak('ch',function(data){
//     console.log(data);
// });


// test.getUserCorrectPerRank('ch',function(data){
//     console.log(data);
// });
// getUserCorrectPerRank
