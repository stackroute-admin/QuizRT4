var Asynchrony = require('asynchrony-di');
var EventExecutor = function (event) {
  this.event=event;
};

EventExecutor.prototype.execute = function (callback) {
  // this.fetchData((function (err,userCountersValue) {
  //   this.fetchBadges(function (err,badge) {
  //     if(userCountersValue>=badge['winCount']){
  //       callback(badge['badgeId']);
  //     }
  //   });
  // }).bind(this));
  if(this.event.EVENT_TYPE=='gameFinish'){
    var asynchrony=new Asynchrony();
    asynchrony.add('nOfConsWin',function(done) {
      done(null,getNumOfConsWin(this.event.userId));
    });
    asynchrony.add('nOfWin',function(done) {
      done(null,getNumOfWin(this.event.userId));
    });
    doc=getAllBadges();
    var dep=doc.badgeDep;
    dep.push(doc.badgeFunct);
    asynchrony.invoke(dep);
  }
};
module.exports=EventExecutor;
