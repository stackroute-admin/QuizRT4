var express = require('express'),
    Reservoir = require('reservoir'),
    router = express.Router(),
    Profile = require("../models/profile"),
    formidable = require('formidable'),
    path = require('path'),
    fs = require('fs'),
    slug = require('slug'),
    confTournament = require("../models/confTournament");
    topicsTournament= require("../models/topic");
    var data=[];
    router.post('/confTournamentHandler',function(req , res){
        //  console.log(req);
         data=req.body;
         console.log("HHHHHHHHHHHHHHHHHHHHHHHHIIIIIIIIIIIIIIII"+data.Title);
         res.send(data);
         createMongoInstance(data);

        });
        function createMongoInstance(data){
          console.log("hellllllllllllllllllooooooooooooooo"+data.Title);

          var confTournamentModel=new confTournament()
          topics=[];

          var tournamentId=""+data.Title;
          confTournamentModel._id=""+data.Title;
          confTournamentModel.title = ""+data.Title;
          confTournamentModel.description=""+data.Description;
          confTournamentModel.matches=4;
          confTournamentModel.playersPerMatch=data.noOfPlayers;
          confTournamentModel.imageUrl=""+data.Image;
          confTournamentModel.tournamentFollowers= 45;
          confTournamentModel.rulesDescription = ""+data.specificRule;
          confTournamentModel.totalGamesPlayed=5;
          confTournamentModel.startDate =data.tournamentStartDate ;
          confTournamentModel.endDate =data.tournamentEndDate;
          var tempLevel=[],
              tempQuestionPaper=[];
          tempLevel.push(data.level);
          tempQuestionPaper.push(data.questionpaper);
          for(var i=0;i<tempLevel.length;i++){
            console.log(data.level[i]);
            var topic = {};
            topic['levelId'] = tournamentId + '_' + (i+1);
            topic['topicId'] = ""+tempLevel[i];
            topic['questionPaper']=""+tempQuestionPaper[i];
             var temp=i+1;
             topic['tournamentType']=data['group'+""+temp];
             console.log(data['difficulty'+""+temp]);
          topic['difficultyLevel']=data['difficulty'+""+temp];
            topics.push(topic);
          }

          confTournamentModel.topics=topics;



          confTournamentModel.save(function(err, confTournament){
              if(err){
                  console.log('Database error. Could not save tournament details: ' + data.title);
                  // res.writeHead(500, {'Content-type': 'application/json'});
                  // res.end(JSON.stringify({ error:'Could not save tournament details: ' + data.title}) );

              }
               console.log("tournamentId created :",confTournament._id);
              // res.json({ error: null, tournamentId:confTournament._id });

          });
        };



        router.get('/getInfoTopics',function(req,res){
          var tempTopicName=[];

        tempTopicName=  topicsTournament.distinct("topicName", function(err, result) {
          if(err) { return res.status(500).send(); }
          // console.log('result: ' + JSON.stringify(result));
        var topicObj={'topicName':result};
          res.send(JSON.stringify(topicObj));

        });
        //console.log( topicsTournament.distinct("topicName"));
        // for(var i=0;i<tempTopicName.length;i++)
        // {
        //   var tempTopic={};
        //   tempTopic['topicName']=tempTopicName[i];
        //   getArray.push(tempTopic);
        // }
        //
        // res.send(JSON.stringify(getArray));
        //

         });

module.exports = router;
