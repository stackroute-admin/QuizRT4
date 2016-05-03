var Badge = require('../../models/badge');
var Profile = require('../../models/profile');
var badgesData = require('../../test-data/badgesData.js');
var Q = require('q');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizRT3',function () {
  console.log('connected');
});
var badgesManager = function(){
  this.badges = badgesData;

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


  this.fetchAllBadges = function(callback){
    Badge.find({},callback);
  };

  this.addBadgesToUser = function(userId, badgeId, callback){
    console.log('hi user'+userId);
    Profile.findOneAndUpdate({userId:userId}, {$push:{badges:badgeId}}, {upsert:false, new:true}, callback);
  }

  this.getUserBadges = function(userId){
    Profile.findOne({userId:userId}, function(err, doc) {
        if(err)
          console.log(err);
        //console.log(doc);
        return docs;
    });
  }
}
module.exports=badgesManager;
