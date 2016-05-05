var Profile = require("../../models/profile"),
  Friends = require("../../models/friendship");

//FRND for friend Request
//GRPPLAY for group play
//BDGS  for badges .. they dnt do anything
module.exports = {
  saveUserInteractions: function(metadata) {
    console.log(metadata);
    if (metadata.type === 'FRND') {
      //method to update fields
      Profile.getUserIdFromId(metadata.from, metadata.to).then(function(ret) {
        var query = ret.map(function(e) {
          return e._id
        });

        //db.getCollection('friendship_Collection').update({'userIds':{$all:['572aa8e7801d83e02d564a56', '572aa8c5801d83e02d564a54']}},{$set:{'acceptanceState':1}})
        console.log(query);
        Friends.update({
          'userIds': {
            $all: ['572aa8e7801d83e02d564a56', '572aa8c5801d83e02d564a54']
          }}
        , {
          $set: {
            'acceptanceState': 1
          }
        },function(data){
          console.log(data);
        })
      })
    } else if (metadata.type === 'GRPPLAY') {
      //method to update fields
    } else {
      //do nothing throw error
    }
  }
}
