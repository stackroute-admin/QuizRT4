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
//   Name of Developers  Raghav Goel, Kshitij Jain, Lakshay Bansal, Ayush Jain, Saurabh Gupta, Akshay Meher
//  
 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizRT');
var db = mongoose.connection;

  // console.log("this is form profile data"+req.params.id);
 
var quizModel =require('../models/quiz.js');

quizModel.findOne({quizId: "quiz1"})
          .exec(function(err,data){
            profileData = data;
            console.log(JSON.stringify(profileData, null, 4));

          });