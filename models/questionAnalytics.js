/**
 * Created for collecting question statistics
 */
var mongoose = require('mongoose'),
    questionAnalyticsSchema = mongoose.Schema({
        questionId: String,
        stats : {
            qAskedCount : Number,
            qAnsweredCorrectCount: Number,
            qAnsweredWrongCount: Number
        }
    }),
    questionAnalytics = mongoose.model('questionAnalytics', questionAnalyticsSchema);

module.exports = questionAnalytics;
