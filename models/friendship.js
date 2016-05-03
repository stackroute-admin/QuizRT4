var mongoose = require('mongoose'),
profile = require('./profile.js'),
Q = require('q'),
_ = require("underscore"),
friendshipSchema = new mongoose.Schema({
  userIds : [{ type: String, ref: 'Profile'}],
  acceptanceState : Number, // 0 - Request Sent; 1 - Accepted ; 2- Rejected
  lastUpdatedDate : Date
});

function getUserIds(userToSearch,user){
   var deferred = Q.defer();
   var doc = [];
   mongoose.model('friendship')
  .find({userIds : userToSearch})
  .populate('userIds')
  .exec(function(err,docs){
    if (err) {
      console.log(err);
    }
    docs.map(function(e) {doc.push(_.pluck(e["userIds"],'userId'))});
    doc =_.without(doc.reduce(function(a, b) { return _.union(a,b)}) , user)
    deferred.resolve(doc);
  });
  return deferred.promise;
}

friendshipSchema.statics.search = function search(user){
  var deferred = Q.defer();
  var userToSearch = profile.findOne({userId : user})
  .select({'_id' : 1})
  .exec(function(err,docs){
    if(err){
      console.log(err)
    }
    getUserIds(docs._id,user).then(function(ret){
      deferred.resolve(ret);
    });
  });
  return deferred.promise;
};



Friendship = mongoose.model('friendship', friendshipSchema,'friendship_Collection');

module.exports = Friendship;
