var express = require('express');
var router = express.Router();
var Notification = require('../models/notifications');


router.route('/')
  .get(function(req, res) {
  //  console.log(req.session.user);
    Notification.find({ to: req.session.user }).select('-_id metaData').sort('-dateAdded').exec(function(err,data){
      res.send(data);
    });

    // var notification = new Notification({
    //   dateAdded: new Date(),
    //   to:'abcdefk',
    //   metaData: {from:'abcdefh',type:"FRND"},
    //   seen: false
    // });
    // notification.save(function(reply){
    //   res.send(reply);
    // })


  })
  .post(function(req, res) {

  })


//}

module.exports = router;
