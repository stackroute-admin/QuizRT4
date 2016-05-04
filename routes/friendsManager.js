var User = require('../models/user.js'),
    Friend = require('../models/friendship.js'),
    Profile = require('../models/profile.js');


var FriendsManager = function() {

var getUserDetails = function(client, onlineUsers, myuserId) {

    var onlineFriends = []; 
    var friends = [];
   
    Friend.search(myuserId)
          .then(function(friends) { 
             if (friends.length != 0) {
                var updated = 0;
		friends.forEach(function(profile) {
                 Profile.findOne({userId: profile}). then (function (profile) { 
                    var onlineFriend = {id:profile.userId , name: profile.name, image: profile.imageLink, badge: profile.badge, wins:profile.wins, country:profile.country};

		    if (onlineUsers.indexOf(profile.userId) != -1)
		      onlineFriend.online = true;
		    else 
		      onlineFriend.online = false;

		    onlineFriends.push(onlineFriend);
		    onlineFriends.sort(function(a,b) {
		       return (b.online - a.online);
		    });

                    if (++updated == friends.length) {
	                 client.emit('onlineFriends', onlineFriends);
	                 console.log("emitted OnlineFriends");
                    }
                });
			      
	      });
	       
	    };
   }); 
 };  

 this.getOnlineFriends = function(client, redisClient, myuserId) {
    var onlineUsers = [];
    var updated = 0;
    redisClient.keys("sess:*", function(error, keys) {
       keys.forEach(function(key) {
         redisClient.get(key, function(error, session) {
            session = JSON.parse(session);
            onlineUsers.push (session.user); 
            if (++updated == keys.length){
               getUserDetails(client, onlineUsers, myuserId);
            }
          });
       });
    });
 };

};

module.exports = new FriendsManager();
