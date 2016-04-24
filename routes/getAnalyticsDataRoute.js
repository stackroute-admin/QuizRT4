
//Copyright {2016} {NIIT Limited, Wipro Limited}
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//
//   Name of Developers  Raghav Goel, Kshitij Jain, Lakshay Bansal, Ayush Jain, Saurabh Gupta, Akshay Meher
//                       + Anil Sawant
//  + Abhishek Kumar , Ghulam Rabbani

var express = require('express'),
    router = express.Router(),
    getGameStatObj = require('./getGameStat'),
    Q = require('q');

router.get('/getCurrentGameStat', function(req, res, next) {
  if ( req.session && req.session.user ) {
    console.log('Authenticated user: ' + req.session.user);
    if( !(req.session.user == null) ){
      var usr = req.session.user;
        getGameStatObj.getCurrentGameStat(req.query.userId,req.query.gameId,function(result){
            // check if the returned data has error
              if ('error' in result) {
                console.log('Database error. Could not load user Analytics.');
                res.writeHead(500, {'Content-type': 'application/json'});
                res.end(JSON.stringify({ error:'error fetching data!'}) );
              }
              else {
                var resultArr = [];
                result.forEach(function(val){
                    var totalCount = val.correctCount + val.wrongCount + val.skipCount;
                    resultArr.push(
                        {
                            'legendLabel' : 'Correct',
                            'magnitude' : (val.correctCount*100)/totalCount,
                            'TopicId' : val.topicId,
                            'userId' : val.userId
                        },
                        {
                            'legendLabel' : 'Wrong',
                            'magnitude' : (val.wrongCount*100)/totalCount,
                            'TopicId' : val.topicId,
                            'userId' : val.userId
                        },
                        {
                            'legendLabel' : 'Skip',
                            'magnitude' : (val.skipCount*100)/totalCount,
                            'TopicId' : val.topicId,
                            'userId'  :val.userId
                        }

                    );
                })
                 res.json(resultArr);
              }
        });
    }
  } else {
    console.log('User not authenticated. Returning.');
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Failed to get user session. Kindly do a fresh Login.' }) );
  }
 });




 router.get('/getAnsStatForUser', function(req, res, next) {
   if ( req.session && req.session.user ) {
     console.log('Authenticated user: ' + req.session.user);
     if( !(req.session.user == null) ){
       var usr = req.session.user;
         getGameStatObj.getAnsStatForUser(req.query.userId,req.query.gameId,req.query.responseType, function(result){
             // check if the returned data has error
               if ('error' in result) {
                 console.log('Database error. Could not load user Analytics.');
                 res.writeHead(500, {'Content-type': 'application/json'});
                 res.end(JSON.stringify({ error:'error fetching data!'}) );
               }
               else {
                 var resultArr = [];
                 result.forEach(function(val){
                     resultArr.push(
                         {
                             'legendLabel-X' : 'Question Number',
                             'legendLabel-Y' : 'Response Time',
                             'responseTime' : val.responseTime,
                             'questionNumber' : val.questionNumber
                         }
                     );
                 })
                  res.json(resultArr);
               }
         });
     }
   } else {
     console.log('User not authenticated. Returning.');
     res.writeHead(401);
     res.end(JSON.stringify({ error: 'Failed to get user session. Kindly do a fresh Login.' }) );
   }
  });





  router.get('/getProfileStatForUser', function(req, res, next) {
    if ( req.session && req.session.user ) {
      console.log('Authenticated user: ' + req.session.user);
        if( !(req.session.user == null) ){
            var usr = req.query.userId,
                resultArr = [];
            Q.all([
                getGameStatObj.getUserWinRank(usr),
                getGameStatObj.getUserPointsRankAndStreak(usr),
                getGameStatObj.getUserAvgRespTimeRank(usr),
                getGameStatObj.getUserCorrectPerRank(usr)

                ]).spread(function(res1,res2,res3,res4){
                    resultArr.push(res1,res2,res3,res4);
                    res.json(resultArr);
            });
        }
    } else {
      console.log('User not authenticated. Returning.');
      res.writeHead(401);
      res.end(JSON.stringify({ error: 'Failed to get user session. Kindly do a fresh Login.' }) );
    }
   });

   // Route to get Visit count and Game Played count monthly
   //  "statType" here refers "visits"  or "gamePlayed"
   router.get('/getGameVisitStatForUser', function(req, res, next) {
     if ( req.session && req.session.user ) {
       console.log('Authenticated user: ' + req.session.user);
         if( !(req.session.user == null) ){
             var usr = req.query.userId;
            getGameStatObj.getMonthlyGameStat(usr,req.query.year,req.query.statType)
                .then(function(retArr){
                    console.log(retArr);
                    res.json(retArr);
                }
            );
         }
     } else {
       console.log('User not authenticated. Returning.');
       res.writeHead(401);
       res.end(JSON.stringify({ error: 'Failed to get user session. Kindly do a fresh Login.' }) );
     }
    });


module.exports = router;
