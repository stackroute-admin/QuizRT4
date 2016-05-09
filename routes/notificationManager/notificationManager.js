var Profile = require("../../models/profile"),
Friends = require("../../models/friendship"),
Notification = require('../../models/notifications');

//FRND for friend Request
//GRPPLAY for group play
//BDGS  for badges .. they dnt do anything

module.exports = {
  handleResponse : function(metadata, client) {
    if (metadata.type === 'FRND') {
      var acceptanceState = metadata.event === 'accept' ? 1 : 2 ;
      var query = [];
      Profile.getUserIdFromId(metadata.from, metadata.to).then(function(ret) {
        query = ret.map(function(e) { return e._id });
        console.log(query);
        Friends.update({'userIds': {$all: query}}, {$set: {'acceptanceState': acceptanceState}}, function(data) {
          console.log('Friend Request Accepted');
        })
      })
    } else if (metadata.type === 'GRPPLAY') {
      //method to update fields
    } else {
      //do nothing throw error
    }
  },

  saveNotification:  function(metaData){
    var notification = new Notification({
      dateAdded: new Date(),
      metaData: metaData,
      seen: false
    });
    notification.save(function(reply) {
      //res.send(reply);
      console.log("save reply",reply);
    });

  },

  inviteFriendsToPlay: function(data, client) {
    console.log(data, "invited to play");
    var notificationsMeta = {
      from: data.user,
      to  : data.invitedFriendsList,
      type: "GRPPLAY"
    }
    this.saveNotification(notificationsMeta);
    /* Send Update to User on notification */
    this.updateUserNotification(data.invitedFriendsList, client);
  },

  getNotifications: function(userId, client) {
    Notification.find({
      'metaData.to': userId
    }).where('seen').equals(false).select('_id metaData').where('seen').equals(false).sort('-dateAdded').exec(function(err, data) {
      console.log(data);
      client.emit('NotificationList', data);
    });
  },

  handleFriendRequest: function(data, client){
    /* Store the Meta Data */
    var friendship = new Friends({userIds : [data.from._id , data.to._id] , acceptanceState : 0 , lastUpdatedDate : new Date()});
    friendship.save(function(err, updatedUserProfile ) {
      console.log('Data Saved');
    })
    var notification = new Notification({
      dateAdded: new Date(),
      metaData: {from : data.from.userId , to : data.to.userId , type : 'FRND'},
      seen: false
    });
    notification.save(function(reply) {
      //res.send(reply);
      console.log("save reply",reply);
    });

    /* Send Update to User on notification */
    this.updateUserNotification([data.to.userId], client);
  },

  updateUserNotification: function(users, client) {
    client.broadcast.emit("NewNotification", users);
    console.log("Sent update for users", users);
  }

}
