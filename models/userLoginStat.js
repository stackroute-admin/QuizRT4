/**
 * Created by GH316885 on 3/17/2016.
 */
var mongoose = require('mongoose'),
    userLoginStatSchema = mongoose.Schema({
        userId: String,
        loginTime: Date
    });

 module.exports = userLoginStatSchema;
