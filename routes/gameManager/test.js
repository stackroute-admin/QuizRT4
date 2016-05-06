var test = require('./prebuildQuestions.js');
var mongoose = require('mongoose');
//console.log(test.getPrebuildQuestions);
mongoose.connect('mongodb://localhost/quizRT3');
test.getPrebuildQuestions('T1','Question Paper 3',2,function (err,question) {
  if ( err ) {

    //console.log('ERROR: Failed to get quiz questions for ' + gameId + '. Cannot start the game. Terminating the game launch.');
    console.error(err);
    // return false;
  }
  console.log('---------------------------------------------');
  console.log(question);
  // question.Question.forEach(function(q) {
  //   console.log(q.options);
  // });
});
