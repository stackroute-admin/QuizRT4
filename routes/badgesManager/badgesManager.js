var Badge = require('../../models/badge');
var Profile = require('../../models/profile');
var badgesData = require('../../test-data/badgesData.js');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quizRT3');

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

  this.fetchAllBadges = function(){
    Badge.find({},function(err,docs){
      if(err)
        console.log(err);
      //console.log(docs);
      return docs;
    });
  };

  this.addBadgesToUser = function(userId, badgeId){
    Profile.findOneAndUpdate({userId:userId}, {$push:{badges:badgeId}}, {upsert:false, new:true},function(err, doc) {
        if(err)
          console.log(err);
        //console.log(doc);
        return docs;
    });
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

//new badgesManager().getUserBadges('anil2');
//new badgesManager().addBadgesToUser('anil2','onARoll');
new badgesManager().loadBadgesToDB();
