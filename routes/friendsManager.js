var User = require('../models/user.js'),
    Friend = require('../models/friendship.js'),
    Profile = require('../models/profile.js');


var FriendsManager = function() {

var getUserDetails = function(client, onlineUsers, myuserId) {

    console.log("Into function", onlineUsers, myuserId);
    var onlineFriends = []; 
    var friends = [];
   
    console.log("Get Friends", myuserId);
    Friend.find({}).populate('userIds')
          //.find({$in: {'sai': userIds}})
          .then(function(docs) { 
             docs.forEach(function(doc) {
               console.log(doc.userIds);
   
                console.log("***********", doc.userIds[0].local.username, myuserId); 
               if (doc.userIds[0].local.username == myuserId) 
                  friends.push(doc.userIds[1].local.username);
               else if (doc.userIds[1].local.username == myuserId) 
                  friends.push(doc.userIds[0].local.username);
             });
             console.log(friends.length, "Result");

             if (friends.length != 0) {
                var updated = 0;
		friends.forEach(function(profile) {
		 console.log("In ForEach", profile);
                 Profile.findOne({userId: profile}). then (function (profile) { 
                    console.log(profile);
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
	                 console.log("emitted");
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
            //console.log(error,keys); 
       keys.forEach(function(key) {
         redisClient.get(key, function(error, session) {
            session = JSON.parse(session);
            console.log("session", error, session.user); 
            onlineUsers.push (session.user); 
            if (++updated == keys.length){
               console.log(onlineUsers); 
               getUserDetails(client, onlineUsers, myuserId);
            }
          });
       });
    });
 };

};

module.exports = new FriendsManager();
