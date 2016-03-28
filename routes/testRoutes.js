var test = require('./getGameStat');

test.getCurrentGameStat('mz','5b7e3fb0-f018-11e5-9d63-09ab0b030b09',function(data){
    // console.log("done");
    console.log(data);
});

// test.getAnsStat('ch', '5b7e3fb0-f018-11e5-9d63-09ab0b030b09', true, function(data){
//     console.log(data);
// }
// );
//
// // getUserStatForAllGames
//
//     test.getUserStatForAllGames('ch', function(data){
//     console.log(data);
// }
// );
