var Profile = require("../../models/profile"),
    Friends = require("../../models/friendship"),
    Notification = require('../../models/notifications');

//FRND for friend Request
//GRPPLAY for group play
//BDGS  for badges .. they dnt do anything

module.exports = {
  handleResponse : function(metadata, client) {
    console.log(metadata);
    if (metadata.type === 'FRND') {
      if (metadata.event === 'accept') {
        var acceptanceState = 1;
      } else {
        var acceptanceState = 2;
      }
      //method to update fields
      var query = [];
      Profile.getUserIdFromId(metadata.from, metadata.to).then(function(ret) {
        query = ret.map(function(e) {
          return e._id
        });

        //db.getCollection('friendship_Collection').update({'userIds':{$all:['572aa8e7801d83e02d564a56', '572aa8c5801d83e02d564a54']}},{$set:{'acceptanceState':1}})
        console.log(query);
        Friends.update({
          'userIds': {
            $all: query
          }
        }, {
          $set: {
            'acceptanceState': acceptanceState
          }
        }, function(data) {
          console.log(data);
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
    console.log("Received Friend Request");
    this.saveNotification(data);
    /* Send Update to User on notification */
    this.updateUserNotification([data.to], client);
  },

  updateUserNotification: function(users, client) {
     client.broadcast.emit("NewNotification", users);
     console.log("Sent update for users", users);
  }
  
}
