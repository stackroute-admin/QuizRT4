var Event = require('./eventCreator');
var EventExecutor = require('./eventExecutor');
var badgeEligibilityCheck=new function(userId,EVENT_TYPE) {
  this.userId=userId;
  this.EVENT_TYPE=EVENT_TYPE;
}
badgeEligibilityCheck.prototype.check = function () {
  var event=new Event(this.userId,this.EVENT_TYPE);
  var eventExecutor=new EventExecutor(event);
  eventExecutor.execute(function (badgeId) {
    //TODO socket stuffs
  });
};
module.export=badgeEligibilityCheck;
