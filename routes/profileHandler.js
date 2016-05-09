
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
Topic = require("../models/topic"),
Profile = require("../models/profile"),
userSettingsHandler = require('./userSettingsHandler'),
FriendShip = require("../models/friendship"),
Notification = require("../models/notifications");


router.get('/profileData', function(req, res, next) {
  if (req.session && req.session.user ) {
    console.log('Authenticated user: ' + req.session.user);
    if( !(req.session.user == null) ){
      var user = req.session.user;
      Profile.findOne({userId: user})
      .populate("topicsPlayed.topicId")
      .exec(function(err,profileData){
        if (err) {
          console.log('Database error. Could not load user profile.');
          res.writeHead(500, {'Content-type': 'application/json'});
          res.end(JSON.stringify({ error:'We could not load your profile properly. Try again later.'}) );
        }else if( !profileData ){
          console.log('User not found in database.');
          res.writeHead(500, {'Content-type': 'application/json'});
          res.end(JSON.stringify({ error: 'We could not find you in our database. Try again later.'}) );
        }else {
          FriendShip.getFriendsListData(req.session.user).then(function(friends){
            Notification.getNotifications(req.session.user).then(function(notifications){
              console.log(notifications);
              res.json({ error: null, user:profileData , friends : friends , notificationCount : notifications.length });
            });
          })
        }
      });
    }
  }
  else {
    console.log('User not authenticated. Returning.');
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Failed to create user session. Kindly do a fresh Login.' }) );
  }
});


//test
router.get('/topicsList',function(req,res,next){
  var regExp = new RegExp("^"+req.query.topic, 'i');
  Topic.find({'_id': regExp} ,function(err,data){
    res.send(data);
  })
})

router.get('/searchPeople',function(req,res,next){
  var search  =req.query.name;
  var topicVal = req.query.selectTopic;
  switch (req.query.radio) {
    case 'name':
    Profile.find( {'name' : new RegExp(search, 'i')},function(err,data){
      if (data==null) {
        console.log('no results');
      }
      res.send(data);
      console.log(data);
    })
    break;
    case 'topic':
    Profile.find({'topicsPlayed.topicId':topicVal} ,function(err,data){
      console.log(data);
      res.send(data);
    })

    break;
    case 'country':
    Profile.find({'country': new RegExp(search, 'i')},function(err,data){
      res.send(data);
    })

    break;
  }
})



//end
router.get('/profileData/:userId' ,function(req,res){
  var user = req.params.userId;
  Profile.findOne({userId: user})
  .populate("topicsPlayed.topicId")
  .exec(function(err,profileData){
    if (err) {
      console.log('Database error. Could not load user profile.');
      res.writeHead(500, {'Content-type': 'application/json'});
      res.end(JSON.stringify({ error:'We could not load the profile properly. Try again later.'}) );
    }else if( !profileData ){
      console.log('User not found in database.');
      res.writeHead(500, {'Content-type': 'application/json'});
      res.end(JSON.stringify({ error: 'We could not find the user in our database. Try again later.'}) );
    }else {
      FriendShip.getFriendsListData(user).then(function(friends){
        console.log(friends);
        Friendship.getAcceptanceState({user : req.session.user,frienduser :user}).then(function(isfriend){
          res.json({ error: null, user:profileData , isfriend  , friends });
        })
      })


    }
  })
});

//
// router.post('/', function(req,res) {
//   FriendShip.search(req.body.dasd).then(function(relation){
//     res.send(relation.length > 0);
//   })
// });

// add user profile sub-hadlers here
router.use('/userSettings', userSettingsHandler );

module.exports = router;
