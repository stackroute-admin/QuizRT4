var Event = require('./eventCreator');
var mongoose = require('mongoose');
var EventExecutor = require('./eventExecutor');
var BadgesManager = require('./badgesManager');
mongoose.connect('mongodb://localhost/quizRT3',function () {
  console.log('connected');
});
var badgeEligibilityCheck= function(userId,eventType) {
  this.userId=userId;
  this.eventType=eventType;
}
badgeEligibilityCheck.prototype.check = function () {
  //var event=new Event(this.userId,this.eventType);
  var eventExecutor=new EventExecutor(new Event(this.userId,this.eventType));
  eventExecutor.execute((function (badgeId) {
    new BadgesManager().addBadgesToUser(this.userId, badgeId, function(err,doc) {
      if(err)
          console.log(err);
      //TODO socket stuffs
    });
  }).bind(this));
};
module.exports=badgeEligibilityCheck;

new badgeEligibilityCheck('ie','gameFinish').check();
