var Asynchrony = require('asynchrony-di');
var BadgesManager = require('./badgesManager');
//var EventManager = require('./eventManager');
var counterEvaluator = require('./counterEvaluator/counterEvaluator');
var _ = require('underscore');

var badgesManager = new BadgesManager();
//var eventManager = new EventManager();

var EventExecutor = function (event) {
  this.event=event;
};

EventExecutor.prototype.execute = function (callback) {
  var userId = this.event.userId;
  var eventType = this.event.eventType;
  var asynchrony = new Asynchrony();

  //get event related badges and counters
  /*var eventData = {
    badges: ['thumbsUp','goodHabit','highFive'], //has nOfWin, consLogin, nOfWin
    counters: ['nOfWin','nOfConsWin']
  }*/
  eventManager.getEvent(eventType, function(err, eventData){
    var badges = eventData.badges;
    var counters = eventData.counters;
    //filter out badges user already has won
    badgesManager.getUserBadges(userId, function(err, doc) {
      if(err)
        console.log(err);
      badges = _.difference(badges, doc.badges); //get badgeId that the user does not possess
      //console.log('Badges to be evaluated : '+badges);
      badgesManager.getBadgesById(badges, function(err, badgeData){ //get data for probable badges
        if(err)
          console.log(err);
        var badgeCounters = _.uniq(_.flatten(_.pluck(badgeData,'badgeDep')));
        var readOnlyCounters = _.difference(badgeCounters,counters);
        //console.log('Execute counters : '+ counters);
        //console.log('Read-only counters : '+ readOnlyCounters);

        var params = [];
        params.push(userId);

        counters.forEach(function(counter){
          asynchrony.add(counter,[getFunction(counter, params, true)]);
        });

        readOnlyCounters.forEach(function(counter){
          asynchrony.add(counter,[getFunction(counter, params, false)]);
        });

        badgeData.forEach(function(badge){
          var dep=new Array(badge.badgeDep);
          dep.push(badge.badgeFunct);
          asynchrony.invoke(dep).then(function(condition) {
            if(condition){
              callback.apply(null,[badge.badgeId]);
            }
          });
        });
      });
    });
  });
};
module.exports=EventExecutor;
