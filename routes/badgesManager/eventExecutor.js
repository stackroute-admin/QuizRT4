var Asynchrony = require('asynchrony-di');
var BadgesManager = require('./badgesManager');
var counterEvaluator = require('./counterEvaluator/counterEvaluator');
var badgesManager = new BadgesManager();
var EventExecutor = function (event) {
  this.event=event;
};

EventExecutor.prototype.execute = function (callback) {
  if(this.event.eventType==='gameFinish'){
    var asynchrony=new Asynchrony();
    asynchrony.add('nOfWin',[(function(done) {
      counterEvaluator.getNumOfWin(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);
    asynchrony.add('nOfConsWin',[(function(done) {
      counterEvaluator.getNumOfConsWin(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);
    badgesManager.fetchAllBadges(function(err,docs) {
        if(err) return console.log(err);;
        docs.forEach(function(doc){
          var dep=new Array(doc.badgeDep);
          dep.push(doc.badgeFunct);
          asynchrony.invoke(dep).then(function(condition) {
            if(condition){
              callback.apply(null,[doc.badgeId]);
            }
          });
        });
      });
  }
};
module.exports=EventExecutor;
