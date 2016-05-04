var express = require('express'),
    BadgesManager = require('./badgesManager/badgesManager'),
    badgesManager = new BadgesManager(),
    router = express.Router(),
    mongoose = require('mongoose');


router.get('/getAllBadges', function (req, res) {
  badgesManager.fetchAllBadges(function(err, docs){
    if(err)
      console.log(err);
    res.json(docs);
  });
});

module.exports = router;
