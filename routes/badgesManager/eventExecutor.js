var fs = require('fs');
var Injector = require('module');
var EventExecutor = function (event) {
  this.event=event;
};

EventExecutor.prototype.execute = function (callback) {
  this.fetchData((function (err,userCountersValue) {
    this.fetchBadges(function (err,badge) {
      if(userCountersValue>=badge['winCount']){
        callback(badge['badgeId']);
      }
    });
  }).bind(this));
};
module.exports=EventExecutor;
