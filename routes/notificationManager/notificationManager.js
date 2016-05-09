var Profile = require("../../models/profile"),
  Friends = require("../../models/friendship");

module.exports = {
  saveUserInteractions: function(metadata) {
    if (metadata.type === 'FRND') {
      var acceptanceState = metadata.userAcceptance === 'accept' ? 1 : 2;
      var query = [];
      Profile.getUserIdFromId(metadata.from, metadata.to).then(function(ret) {
        query = ret.map(function(e) { return e._id});
        Friends.update({'userIds': {$all: query}}, {$set: {'acceptanceState': acceptanceState}}, function(data) {
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
