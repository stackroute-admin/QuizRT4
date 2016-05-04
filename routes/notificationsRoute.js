var express = require('express');
var router = express.Router();
var Notification = require('../models/notifications');


router.route('/')
  .get(function(req, res) {
    //  console.log(req.session.user);
    Notification.find({
      'metaData.to': req.session.user
    }).where('seen').equals(false).select('-_id metaData').sort('-dateAdded').exec(function(err, data) {
      res.send(data);
    });


  })
  .post(function(req, res) {
    var metaData = {
      from: req.body.from,
      to: req.body.to,
      type: req.body.type
    }
    var notification = new Notification({
      dateAdded: new Date(),
      metaData: metaData,
      seen: false
    });
    notification.save(function(reply) {
      res.send(reply);
    });
    // {
    //   from: 'abcdefh',
    //   type: "FRND"
    // },
  })


//}

module.exports = router;
