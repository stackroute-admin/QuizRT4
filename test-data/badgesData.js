var badgesData = [
  { badgeId: "thumbsUp",
    badgeName:"Thumbs Up",
    badgeDesc:"You have got your first win. Way to go!!",
    badgeUrl:"../images/badges/bronze.png",
    badgeDep:["nOfWin"],
    badgeFunct: function(nOfWin) {
        if(nOfWin==1) {return true}
        else return false;
      }
  },
  {
    badgeId:"onARoll",
    badgeName:"On a Roll",
    badgeDesc:"You are on a roll!! Keep it up!!",
    badgeUrl:"../images/badges/silver.png",
    badgeDep:["nOfConsWin"],
    badgeFunct: function(nOfConsWin) {
        if(nOfConsWin>6) {return true}
        else return false
      }
  },
  {
    badgeId:"responseNinja",
    badgeName:"Response Ninja",
    badgeDesc:"Fast and Accurate. Master of discipline. Enough said!",
    badgeUrl:"../images/badges/gold.png",
    badgeDep:["avgResTimeCrctCurrentGame"],
    badgeFunct: function(avgResTimeCrctCurrentGames) {
        if(avgResTimeCrctCurrentGame<0.5) {return true}
        else return false
      }
  },
  {
    badgeId:"goodHabit",
    badgeName:"Good Habit",
    badgeDesc:"You come here everyday, committed to your goal. Keep going and victory will be yours.",
    badgeUrl:"../images/badges/bronze.png",
    badgeDep:["consLogin"],
    badgeFunct:function(consLogin) {
        if(consLogin>=5) {return true}
        else return false
      }
  },
  {
    badgeId:"jackOfAll",
    badgeName:"Jack Of All",
    badgeDesc:"You have played games in more than 10 topics. You are knowledgable and versatile. Keep pushing your limits!!",
    badgeUrl:"../images/badges/silver.png",
    badgeDep:["nOfUniqTopicPlayed"],
    badgeFunct: function(nOfUniqTopicPlayed) {
        if(nOfUniqTopicPlayed>=10) {return true}
        else return false
      }
  },
  {
    badgeId:"inspiration",
    badgeName:"Inspiration",
    badgeDesc:"You have played more than 25 games. You are an inspiration to all!!",
    badgeUrl:"../images/badges/gold.png",
    badgeDep:["nOfGamePlayed"],
    badgeFunct: function(nOfGamePlayed) {
        if(nOfGamePlayed>=25) {return true}
        else return false
      }
  },
  {
    badgeId:"highFive",
    badgeName:"High Five",
    badgeDesc:"You have won 5 games!! Give me a five!! Yeah!",
    badgeUrl:"../images/badges/silver.png",
    badgeDep:["nOfWin"],
    badgeFunct: function(nOfWin) {
        if(nOfWin>=5) {return true}
        else return false
      }
  },
  {
    badgeId:"wiseOne",
    badgeName:"Wise One",
    badgeDesc:"You got it all right, O wise one!! I bow to thy wisdom. Keep going!!",
    badgeUrl:"../images/badges/gold.png",
    badgeDep:["nOfCrctResCurGame"],
    badgeFunct: function(nOfCrctResCurGame) {
        if(nOfCrctResCurGame==100) {return true}
        else return false
      }
  },
  {
    badgeId:"magister",
    badgeName:"Magister",
    badgeDesc:"You have won 20 games in the same topic. We acknowledge your mastery and award you this. Keep winning!!",
    badgeUrl:"../images/badges/gold.png",
    badgeDep:["nOfWinForATopic"],
    badgeFunct: function(nOfWinForATopic) {
        if(nOfWinForATopic>=20) {return true}
        else return false
      }
  },
  {
    badgeId:"hatTrick",
    badgeName:"Hat Trick",
    badgeDesc:"That's a hat trick win!! Don't stop here, there is more to achieve!!",
    badgeUrl:"../images/badges/silver.png",
    badgeDep:["nOfConsWin"],
    badgeFunct: function(nOfWinForATopic) {
        if(nOfConsWin==3) {return true}
        else return false
      }
  },
];
module.exports = badgesData;
