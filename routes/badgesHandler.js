var express = require('express'),
    BadgesManager = require('./badgesManager/badgesManager'),
    badgesManager = new BadgesManager(),
    router = express.Router(),
    mongoose = require('mongoose');


router.post('/', function (req, res) {
  var userId = req.body.userId;
  switch(req.body.requestType){
    case 'getAllBadges' :
      badgesManager.fetchAllBadges(function(err, docs){
        if(err)
          console.log(err);
        res.json(docs);
      });
      break;
    case 'getBadgesById' :
      var badgeIds = req.body.badgeIds;
      badgesManager.getBadgesById(badgeIds, function(err, docs){
        if(err)
          console.log(err);
        res.json(docs);
      });
      break;
  }
});

module.exports = router;
