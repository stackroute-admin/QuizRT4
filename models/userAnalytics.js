/**
 * Created by GH316885 on 3/17/2016.
 */
var mongoose = require('mongoose'),
    userAnalyticsSchema = mongoose.Schema({
        userId: String,
        gameId: String,
        tournamentId: String,
        topicId: String,
        questionId: String,
        selectedOptionId : Number,
        isCorrect : Boolean,
        responseTime: Number,
        gameTime: Date,
        totalQuestionCount: Number
    });

 module.exports = userAnalyticsSchema;
