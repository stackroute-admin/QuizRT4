var Reservoir = require('reservoir'),
    Question = require("../../models/question.js"),
    util = require('util'),
    questionPaper = require('../../models/questionPaper');
module.exports = {
  getPrebuildQuestions: function( topicId, questionPaperName, noOfQs, done ) {
    if ( isNaN(noOfQs) ) {
      done( 'noOfQs is not a number', null );
    } else {
      questionPaper.find({"name":questionPaperName}).populate('questions') // retrieve questions from Question Paper collection for questionPaperName
      .exec( function(err, questions) {
        if ( err ) {
          done( 'Questions cannot be read from mongo.', null );
        } else {
          var myReservoir = Reservoir( noOfQs ),
              fewQuestions = [];
          questions.forEach(function(e) {
            console.log('das',e);
            myReservoir.pushSome(e);
          });

          for (var i = 0; i < noOfQs; i++) {
            console.log('few',fewQuestions);
            fewQuestions.push(myReservoir[i]);
          }
          fewQuestions[0] ? done( null, fewQuestions) : done( 'No Questions in QuestionBank for ' + topicId + '.', null ); // if no questions send null else send the questions
        }
      });
    }
  }
}
