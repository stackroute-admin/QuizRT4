var mongoose = require('mongoose'),
    friendshipSchema = new Mongoose.Schema({
      userIds : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
      acceptanceState : Number, // 0 - Request Sent; 1 - Accepted ; 2- Rejected
      lastUpdatedDate : Date
    });

  Friendship = mongoose.model('friendship', userSchema,'friendship_Collection');
  module.exports = Friendship;
