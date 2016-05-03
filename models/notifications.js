var mongoose = require('mongoose'),
  notificationSchema = new mongoose.Schema({
    dateAdded: 'Date',
    to: 'String',
    metaData: {},
    seen: 'Boolean'
  }),
  Notification = mongoose.model('Notification', notificationSchema, "notification_collection");

module.exports = Notification;
