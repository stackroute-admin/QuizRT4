/**
 * Created by GH316885 on 3/22/2016.
 */

var mongoose = require('mongoose');
var analyticsDbConObj = mongoose.createConnection('mongodb://localhost/analyticsDB');

module.exports = analyticsDbConObj;
