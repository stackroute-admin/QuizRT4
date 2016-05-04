var Badge = require('../../models/badge');
var Profile = require('../../models/profile');
var badgesData = require('../../test-data/badgesData.js');

var badgesManager = function(){
  this.badges = badgesData;

  //Load badge data from a js file (badgesData.js)
  this.loadBadgesToDB = function(){
    this.badges.forEach(function(badgeData){
      var badge = new Badge();
      badge.badgeId = badgeData.badgeId;
      badge.badgeName = badgeData.badgeName;
      badge.badgeDesc = badgeData.badgeDesc;
      badge.badgeUrl = badgeData.badgeUrl;
      badge.badgeDep = badgeData.badgeDep;
      badge.badgeFunct = badgeData.badgeFunct;
      Badge.findOneAndUpdate({badgeId:badge.badgeId},badge,{upsert:true, new:true},function(err, doc) {
          if(err)
            console.log(err);
          console.log(doc);
      });
    });
  };

  //Get all the badges from DB
  this.fetchAllBadges = function(callback){
    Badge.find({},callback);
  };

  //Add badges to user profile
  this.addBadgesToUser = function(userId, badgeId, callback){
    Profile.findOneAndUpdate({userId:userId}, {$push:{badges:badgeId}}, {upsert:false, new:true}, callback);
  }

  //Get all badges won by a particular user
  this.getUserBadges = function(userId){
    Profile.findOne({userId:userId},{badges:1,_id:0}, function(err, doc) {
        if(err)
          console.log(err);
        return doc;
    });
  }
}
module.exports=badgesManager;
