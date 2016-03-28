var userProfile = require('../models/profile');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizRT3');

// get overall points for all users
var o = {};
o.map = function () {
                       var key = this.userId;
                       for (var idx = 0; idx < this.topicsPlayed.length; idx++) {
                            var value = this.topicsPlayed[idx].points;
                            emit(key, value);
                       }
                   }

o.reduce = function (key, values ) {
        return vals = Array.sum(values);
     }
// o.sort = { points: -1 }

// o.query = { 'userId' : 'ch'}
// o.out = {replace:'testMapReduceOutput'}

userProfile.mapReduce(o, function (err, results) {
  console.log(results)
  mongoose.disconnect();
});
