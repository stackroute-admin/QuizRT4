var express = require('express');
var router=express.Router();
var getLevelAnalyticsObj=require('./levelAnalytics');
router.get('/levelPromoter',function (req,res,next) {
  if(req.session && req.session.user===req.query.userId){
    var user=req.query.userId;
    getLevelAnalyticsObj.getCurrentLevel(req.query.userId,req.query.levelName,function(remainingBadges){
      if ('error' in result) {
        console.log('Database error. Could not load user Level Analytics.');
        res.writeHead(500, {'Content-type': 'application/json'});
        res.end(JSON.stringify({ error:'error fetching data!'}) );
      }
      else{
          var promotionInfo=[];
          remainingBadges.forEach(function(badges){
            //If this user has all badges which are present in the level-sublevel then we will promote the user into another level.
            //Rule for each badge=badges.badgeRule
            //each badgeName=badges.badgeName
            // var userStat=req.query.userStat;
            // if userStat will satisfy the badges.badgeRule then we will give    the badge to this user.
            var badgeName=function (userStat,rule) {
              var getBadge=1;
              forEach(badges.rule,function(param) {
                if (userStat.param<param){
                    getBadge=0;
                    break;
                }
              });
              if(getBadge===1){
                return badges.badgeName;
              }
              return null;
            }(req.query.userStat,badges.rule);

            if(badgeName!==null){
              if(remainingBadges.length==1){
                if(req.query.sublevel==5){
                  //uodate the profile.js for adding this badge
                  //as well as update the level
                  promotionInfo=[{levelName:nextLevel,sublevelName:1,badgesEarned:badges.badgesName}];
                }
                else{
                  //uodate the profile.js for adding this badge
                  //as well as update the sublevel
                  promotionInfo=[{levelName:sameLevel,sublevelName:nextsubLevel,badgesEarned:badges.badgesName}];
                }
              }
              else{
                promotionInfo=[{levelName:sameLevel,sublevelName:sameSubLevel,badgesEarned:badges.badgesName}];
              }
              break;
            }
          });
         res.json(promotionInfo);
      }
    }
  }
  else{
    console.log('User not authenticated. Returning.');
    res.writeHead(401);
    res.end(JSON.stringify({ error: 'Failed to get user session. Kindly do a fresh Login.' }) );
  }
});
