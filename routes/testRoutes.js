var test = require('./getGameStat');

// test.getCurrentGameStat('mz','e9ef09b0-f594-11e5-b686-897a16decc19',function(data){
//     // console.log("done");
//     console.log(data);
// });
//
// test.getAnsStat('ch', 'e9ef09b0-f594-11e5-b686-897a16decc19', false, function(data){
//     console.log(data);
// }
// );
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

test.getAnsStatForUser('ch', 'e66ea670-f80e-11e5-ab4c-6b9f368b52c1', 'wrong', function(data){
    console.log('wsdfgvb');
    console.log(data);
});


// getAnsStatForUser: function(userId, gameId, responseType, done)
