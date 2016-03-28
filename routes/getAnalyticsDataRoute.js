
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

var express = require('express'),
    router = express.Router(),
    getGameStatObj = require('./getGameStat');

router.get('/getCurrentGameStat', function(req, res, next) {
  if ( req.session && req.session.user ) {
    console.log('Authenticated user: ' + req.session.user);
    if( !(req.session.user == null) ){
      var usr = req.session.user;
        getGameStatObj.getCurrentGameStat(req.param("userId"),req.param("gameId"),function(result){
            // check if the returned data has error
              if ('error' in result) {
                console.log('Database error. Could not load user Analytics.');
                res.writeHead(500, {'Content-type': 'application/json'});
                res.end(JSON.stringify({ error:'error fetching data!'}) );
              }
              else {
                // res.json({ error: null, user:profileData });
                 res.json(result);

              }
        });
    }
  } else {
    console.log('User not authenticated. Returning.');
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Failed to get user session. Kindly do a fresh Login.' }) );
  }
 });

module.exports = router;
