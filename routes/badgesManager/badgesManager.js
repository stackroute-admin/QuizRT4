var badge = require('../../models/badge');
var fs = require('fs');
var path = require('path');
var dataFile = path.resolve(__dirname,"../../test-data/badgesRule.json")

var badgesManager = function(){
  this.badges = [];

  this.loadBadgesToDB = function(){
    fs.readFile(dataFile, function(err,data){
      if(err)
        console.log(err);
      this.badges = JSON.parse(data);
    });
  };

  this.add = function(){

  };

  this.delete = function(){

  };

  this.update = function(){

  };

}


new badgesManager().loadBadgesToDB();
