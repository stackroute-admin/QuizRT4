//Copyright {2016} {NIIT Limited, Wipro Limited}
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//
//

var questionPaper = require('../models/questionPaper'),
    questionsFromQB=require('../models/question.js'),
    prebuildQuestionBank=require('./gameManager/prebuildQuestions.js'),
    express = require('express'),
    questionBank=require('./gameManager/questionBank.js'),
    Q = require('q'),
    router = express.Router(),
    util = require('util');

router.route('/getQPaper/:topicId')
      .get(function(request,response){
        console.log(request.params.topicId);
        questionPaper.find({'topics' : request.params.topicId})
                           .exec(function(err, questionPaperNames) {
                             if (err) {
                               return response.send(err);
                             }
                             console.log(questionPaperNames);
                             return response.send(questionPaperNames.map(function(e){return e.name}));
                           });
      });

router.route('/getQuestionsPrebuild/:questionPaperName')
        .get(function(request,response){
          prebuildQuestionBank.getPrebuildQuestions('Harry Potter Movies',request.params.questionPaperName,2,function( err, questions){
            if (err) {
              return response.send(err);
            }
            return response.send(questions);
          });
      });
        // questionPaper.find(request.params.questionPaperName).populate('Question').exec(function(err,data) {
        //   console.log(util.inspect(data,true,5));
        //   console.log(err);

        // questionBank.getQuestionIds(request.params.questionPaper).then(function(data){
        //   console.log(data);
        // });


module.exports = router;
