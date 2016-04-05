// Module to fetch different analytics data from the analyticsDB

//  require model and db conf file to analytics db
var userMapReduceSchema = require('../../models/userMonthlyGameStat'),
    userPointsSchema = require('../../models/userPointsStat'),
    analyticsDbObj = require('.././analyticsDbConObj'),
    mapReduceObj = analyticsDbObj.model('userMonthlyGamePlayedStat', userMapReduceSchema),
    mapReduceObjVisit = analyticsDbObj.model('userMonthlyVisitCountStat', userMapReduceSchema);
    mapReduceObjPoint = analyticsDbObj.model('userPointStat', userPointsSchema);

module.exports = {
    getMapReduceData :function(newRec,done){
        //  check if a record already exists with the user Id
        mapReduceObj.findOne({userId: newRec.userId},function(err,collectionData){
            if (err) {
                console.log("MongoDB Error: " + err);
                done( { 'error': 'dbErr'} );
            }
            if (!collectionData) {
                console.log("No item found, creating collectionData item");
                new mapReduceObj(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-NoItemFound'} );
            }
            else if (collectionData.length === 0){
                console.log("Zero found, creating collectionData item");
                new mapReduceObj(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-dataLengthZero'} );
            }
            else {
                console.log("Found one collectionData item: " );
                var yearPresent = false,
                    notMatchedMonthObjArr = [];
                collectionData.years.forEach(function(vals){
                    if ( vals.yearVal === newRec.years[0].yearVal){
                        // so we have year present now add or update the month value
                        yearPresent = true;
                        newRec.years[0].monthObj.forEach(function(localMObj){
                            var monthFoundFlag = false;
                            for ( i = 0; i < vals.monthObj.length; i++ ){
                                if ( vals.monthObj[i].month === localMObj.month){
                                    vals.monthObj[i].count += localMObj.count;
                                    vals.yearlyCount += localMObj.count;
                                    monthFoundFlag = true;
                                    break;
                                }
                            }
                            if ( !monthFoundFlag ) {
                                notMatchedMonthObjArr.push(localMObj);
                            }
                        });
                    }
                    notMatchedMonthObjArr.forEach(function(mObj){
                        vals.monthObj.push(mObj);
                        vals.yearlyCount += mObj.count;
                    });

                });
                // means we did not got any matching year value so create it
                if ( !yearPresent ){
                    console.log("Year not present appending !" );
                    newRec.years.forEach(function(arr){
                        collectionData.years.push(arr);
                    });
                }
                // Save data once  dataset is modified
                collectionData.save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Record Updated!");
                    }
                });
                done(collectionData);
            }
        });
    },


    saveMapReduceVisitCount :function(newRec,done){
        //  check if a record already exists with the user Id
        mapReduceObjVisit.findOne({userId: newRec.userId},function(err,collectionData){
            if (err) {
                console.log("MongoDB Error: " + err);
                done( { 'error': 'dbErr'} );
            }
            if (!collectionData) {
                console.log("No item found, creating collectionData item");
                new mapReduceObjVisit(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-NoItemFound'} );
            }
            else if (collectionData.length === 0){
                console.log("Zero found, creating collectionData item");
                new mapReduceObjVisit(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-dataLengthZero'} );
            }
            else {
                console.log("Found one collectionData item: " );
                var yearPresent = false,
                    notMatchedMonthObjArr = [];
                collectionData.years.forEach(function(vals){
                    if ( vals.yearVal === newRec.years[0].yearVal){
                        // so we have year present now add or update the month value
                        yearPresent = true;
                        newRec.years[0].monthObj.forEach(function(localMObj){
                            var monthFoundFlag = false;
                            for ( i = 0; i < vals.monthObj.length; i++ ){
                                if ( vals.monthObj[i].month === localMObj.month){
                                    vals.monthObj[i].count += localMObj.count;
                                    vals.yearlyCount += localMObj.count;
                                    monthFoundFlag = true;
                                    break;
                                }
                            }
                            if ( !monthFoundFlag ) {
                                notMatchedMonthObjArr.push(localMObj);
                            }
                        });
                    }
                    notMatchedMonthObjArr.forEach(function(mObj){
                        vals.monthObj.push(mObj);
                        vals.yearlyCount += mObj.count;
                    });

                });
                // means we did not got any matching year value so create it
                if ( !yearPresent ){
                    console.log("Year not present appending !" );
                    newRec.years.forEach(function(arr){
                        collectionData.years.push(arr);
                    });
                }
                // Save data once  dataset is modified
                collectionData.save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Record Updated!");
                    }
                });
                done(collectionData);
            }
        });
    },
// function to parse points data from mapreduec result and storing
// data to "userPointStat" table
    saveMapReduceUserPoints :function(newRec,done){
        //  check if a record already exists with the user Id
        mapReduceObjPoint.findOne({userId: newRec.userId},function(err,collectionData){
            if (err) {
                console.log("MongoDB Error: " + err);
                done( { 'error': 'dbErr'} );
            }
            if (!collectionData) {
                console.log("No item found, creating collectionData item");
                new mapReduceObjPoint(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-NoItemFound'} );
            }
            else if (collectionData.length === 0){
                console.log("Zero found, creating collectionData item");
                new mapReduceObjPoint(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-dataLengthZero'} );
            }
            else {
                console.log("Found one collectionData item: " );
                collectionData.timeStamp = newRec.timeStamp;
                collectionData.totalPoint += newRec.totalPoint;
                // Save data once  dataset is modified
                collectionData.save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Record Updated!");
                    }
                });
                done(collectionData);
            }
        });
    },



    saveMRUserRespTimeStat :function(newRec,done){
        //  check if a record already exists with the user IduserPointStat
        mapReduceObjPoint.findOne({userId: newRec.userId},function(err,collectionData){
            if (err) {
                console.log("MongoDB Error: " + err);
                done( { 'error': 'dbErr'} );
            }
            if (!collectionData) {
                console.log("No item found, creating collectionData item");
                newRec.timeStamp = new Date().toString();
                newRec.lastUpdatedRespTime = new Date().toString();
                newRec.totalPoint = 0;
                new mapReduceObjPoint(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-NoItemFound'} );
            }
            else if (collectionData.length === 0){
                console.log("Zero found, creating collectionData item");
                newRec.timeStamp = new Date().toString();
                newRec.lastUpdatedRespTime = new Date().toString();
                newRec.totalPoint = 0;
                new mapReduceObjPoint(newRec).save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Updated Record!!");
                    }
                });
                done( { 'error': 'dbErr-dataLengthZero'} );
            }
            else {
                console.log("Found one collectionData item: " );
                // collectionData.userId = newRec.userId;
                collectionData.lastUpdatedRespTime = new Date().toString();
                collectionData.totalResponseTime += newRec.totalResponseTime;
                collectionData.numOfQuesAttempted += newRec.numOfQuesAttempted;
                collectionData.avgResponseTime = (collectionData.avgResponseTime+newRec.avgResponseTime)/2;
                collectionData.correctResponseCount += newRec.correctResponseCount;
                collectionData.wrongResponseCount += newRec.wrongResponseCount;
                collectionData.skipResponseCount += newRec.skipResponseCount;
                collectionData.correctPercentage = (collectionData.correctResponseCount * 100)/collectionData.numOfQuesAttempted;
                collectionData.wrongPercentage = (collectionData.wrongResponseCount * 100)/collectionData.numOfQuesAttempted;
                collectionData.skipPercentage = (collectionData.skipResponseCount * 100)/collectionData.numOfQuesAttempted;
                // Save data once  dataset is modified
                collectionData.save(function(err){
                    if(err){
                        console.log("Error updating data");
                    }
                    else {
                        console.log("Record Updated!");
                    }
                });
                done(collectionData);
            }
        });
    }


};
