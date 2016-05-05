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
    //Adding no of wins counter
    asynchrony.add('nOfWin',[(function(done) {
      counterEvaluator.getNumOfWin(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);
    //Adding no of Consecutive Wins counter
    asynchrony.add('nOfConsWin',[(function(done) {
      counterEvaluator.getConsWinCount(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);
    //Adding average response time in current game
    asynchrony.add('avgResTimeCrctCurrentGame',[(function(done) {
      counterEvaluator.avgResTimeCrct(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);
    //Adding consecutive login
    asynchrony.add('consLogin',[(function(done) {
      counterEvaluator.getUserLoginCount(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);

    //Adding number of unique topic played by the player
    asynchrony.add('nOfUniqTopicPlayed',[(function(done) {
      counterEvaluator.getNumOfUniqueTopicPlayed(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);

    //Adding number of game played by the player
    asynchrony.add('nOfGamePlayed',[(function(done) {
      counterEvaluator.getNumOfGamePlayed(this.event.userId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);
    //Adding percentage of correct response in a current game by the player
    asynchrony.add('nOfCrctResCurGame',[(function(done) {
      counterEvaluator.getNumOfCrctResCount(this.event.userId,this.event.gameData.gameId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);

    //Adding number of win for a topic by the player
    asynchrony.add('nOfWinForATopic',[(function(done) {
      counterEvaluator.getNumOfWinForTopic(this.event.userId,this.event.gameData.topicId,function(err,data) {
        if(err) return done(err);
        done(null,data);
      });
    }).bind(this)]);
    badgesManager.fetchAllBadges(function(err,docs) {
        if(err) return console.log(err);
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
