// var mongoose = require('mongoose');
var Injector = require('Injector');
// var getAllBadgesRules = require('./getAllBadgesRules');
var userCounters = require('userCounters');
var UserCounter=function (userId) {
  this.userId=userId;
}
UserCounter.prototype.setCounters = function () {
  var Injector=new Injector();
  Injector.add('nOfWin',[function(done) {
    getNumOfWin(this.userId,function (err,data) {
      if(err){
        throw err;
      }
      else{
          done(null,data);
      }
    });
  }]);

  Injector.add('nOfConsWin',[function(done) {
    getNumOfConsWin(this.userId,function (err,data) {
      if(err){
        throw err;
      }
      else{
          done(null,data);
      }
    });
  }]);

  Injector.add('avgResTimeCrctCurrentGame',[function(done) {
    getAvgResTimeCrctCurrentGame(this.userId,function (err,data) {
      if(err){
        throw err;
      }
      else{
          done(null,data);
      }
    });
  }]);

  Injector.add('consLogin',[function(done) {
    getNumOfConsLogin(this.userId,function(err,data) {
      if(err){
        throw err;
      }
      else{
          done(null,data);
      }
    });
  }]);

  Injector.add('nOfUniqTopicPlayed',[function(done) {
    getNumOfUniqueTopicPlayed(this.userId,function(err,data) {
      if(err){
        throw err;
      }
      else{
          done(null,data);
      }
    });
  }]);

  Injector.add('nOfGamePlayed',[function(done) {
    getNumOfGamePlayed(this.userId,function(err,data) {
      if(err){
        throw err;
      }
      else{
          done(null,data);
      }
    });
  }]);
  Injector.add('nOfCrctResCurGame',[function(done) {
      getNumOfCrctResCurGame(this.userId,function(err,data) {
        if(err){
          throw err;
        }
        else{
            done(null,data);
        }
      });
  }]);

  Injector.add('nOfWinForATopic',[function(done) {
      getNumOfWinForTopic(this.userId,function(err,data) {
        if(err){
          throw err;
        }
        else{
            done(null,data);
        }
      });
  }]);
};
