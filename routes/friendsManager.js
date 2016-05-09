var User = require('../models/user.js'),
  Friend = require('../models/friendship.js'),
  Profile = require('../models/profile.js');


module.exports = function(redisClient) {

  getOnlineFriends = function(client, myuserId) {

    var onlineFriends = [];
    var friends = [];

    Friend.getFriends(myuserId)
      .then(function(friends) {
        if (friends.length != 0) {
          var updated = 0;
          friends.forEach(function(profile) {
            Profile.findOne({
              userId: profile
            }).then(function(profile) {
              var onlineFriend = {
                id: profile.userId,
                name: profile.name,
                image: profile.imageLink,
                badge: profile.badge,
                wins: profile.wins,
                country: profile.country
              };

              /* Check in Redis if the User is Active */
              var redisKey = "User:" + profile.userId;
              redisClient.exists(redisKey, function(err, result) {
                if (result != 1) {
                  onlineFriend.online = false;
                } else {
                  onlineFriend.online = true;
                }
                onlineFriends.push(onlineFriend);

                if (++updated == friends.length) {
                  onlineFriends.sort(function(a, b) {
                    return (b.online - a.online);
                  });
                  client.emit('onlineFriends', onlineFriends);
                  console.log("emitted OnlineFriends");
                }

              });

            });

          });

        };
      });
  };

};
