// function to create an object of the form
// { userId: 'ch',
//   timeStamp: 'Wed Apr 20 2016 16:53:11 GMT+0000 (UTC)',
//   years: [ { yearVal: 2016, yearlyCount: 18, monthObj: [Object] } ] }
//
// where monthObj has below format
//  monthObj:
//    [ { month: 'April', count: 16 },
//      { month: 'February', count: 1 },
//      { month: 'March', count: 1 } ] }

module.exports = {
    createMonthlyUserData : function(userId) {
        retObj = {};
        var date = new Date();
        monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        var yearVal = date.getFullYear(),
            month =   monthNames[date.getMonth()];

        // assign object field value
        retObj.userId = userId;
        retObj.timeStamp = new Date().toString();
        var monthObj = [
            {
                month:month,
                count:1
            }
        ];
        retObj.years = [
                            {
                                yearVal: yearVal,
                                yearlyCount: 1,
                                monthObj:  monthObj
                            }
                        ];
        return retObj;
    },
}
    // mo.createMonthlyUserData(['ch','mz'])
