var mongoose = require('mongoose'),
Q = require('q'),
_ = require('underscore'),
metaDataSchema = new mongoose.Schema({
  from: String,
  to: [String],
  type: String,
  url : String
}),
notificationSchema = new mongoose.Schema({
  dateAdded: 'Date',

  metaData: metaDataSchema,
  seen: 'Boolean'
});


notificationSchema.statics.getNotifications = function getNotifications(user){
  var deferred = Q.defer();
  mongoose.model('Notification').find({'metaData.to': user}).where('seen').equals(false).select('_id metaData').where('seen').equals(false).sort('-dateAdded').exec(function(err, data) {
if(err) deferred.reject(err)
    deferred.resolve(data);
  });

  return deferred.promise;
}

Notification = mongoose.model('Notification', notificationSchema, "notification_collection");

module.exports = Notification;
