var mongoose = require('mongoose'),
  metaDataSchema = new mongoose.Schema({
    from: String,
    to: [String],
    type: String
  }),
  notificationSchema = new mongoose.Schema({
    dateAdded: 'Date',

    metaData: metaDataSchema,
    seen: 'Boolean'
  }),
  Notification = mongoose.model('Notification', notificationSchema, "notification_collection");

module.exports = Notification;
