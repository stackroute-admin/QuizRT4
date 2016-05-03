var badgesData = [
  { _id: "thumbsUp",
    badgeName:"Thumbs Up",
    badgeDesc:"You have got your first win. Way to go!!",
    badgeUrl:"placeholder",
    badgeDep:["nOfWin"],
    badgeFunct: function(nOfWin) {
        if(nOfWin==1) {return true}
      }
  },
  {
    _id:"onARoll",
    badgeName:"On a Roll",
    badgeDesc:"You are on a roll!! Keep it up!!",
    badgeUrl:"placeholder",
    badgeDep:["nOfConsWin"],
    badgeFunct: function(nOfConsWin) {
        if(nOfConsWin>6) {return true}
      }
  },
  {
    _id:"responseNinja",
    badgeName:"Response Ninja",
    badgeDesc:"Fast and Accurate. Master of discipline. Enough said!",
    badgeUrl:"placeholder",
    badgeDep:["avgResTimeCrctCurrentGame"],
    badgeFunct: function(avgResTimeCrctCurrentGames) {
        if(avgResTimeCrctCurrentGame<0.5) {return true}
      }
  },
  {
    _id:"goodHabit",
    badgeName:"Good Habit",
    badgeDesc:"You come here everyday, committed to your goal. Keep going and victory will be yours.",
    badgeUrl:"placeholder",
    badgeDep:["consLogin"],
    badgeFunct:function(consLogin) {
        if(consLogin>=5) {return true}
      }
  },
  {
    _id:"jackOfAll",
    badgeName:"Jack Of All",
    badgeDesc:"You have played games in more than 10 topics. You are knowledgable and versatile. Keep pushing your limits!!",
    badgeUrl:"placeholder",
    badgeDep:["nOfUniqTopicPlayed"],
    badgeFunct: function(nOfUniqTopicPlayed) {
        if(nOfUniqTopicPlayed>=10) {return true}
      }
  }
];
module.exports = badgesData;
