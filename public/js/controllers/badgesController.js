//Copyright {2016} {NIIT Limited, Wipro Limited}
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//
//   Name of Developers Abhishek Kumar , Ghulam Rabbani

angular.module('quizRT')
    .controller('badgesController',function($http,$scope,$rootScope,$location,$badges,$ajaxService){

      function init(){
        $ajaxService.getAllBadges({requestType:'getAllBadges'},
          function(err, result){
          if(err)
            console.log(err);
          $badges.setAllBadges(result.data);
          $scope = angular.extend($scope,{
            badgeArr : $badges.getAllBadges(),
            userBadgeArr : $badges.getUserBadges()
          });
        });
      }

      // redirect to login page if the user's isAuthenticated cookie doesn't exist
      if( !$rootScope.isAuthenticatedCookie ){
        $rootScope.logInLogOutErrorMsg = 'You are logged out. Kindly Login...';
        $rootScope.logInLogOutSuccessMsg = '';
        $location.path('/login');
      } else {
        $rootScope.hideFooterNav = false;
        $rootScope.stylesheetName="badges";
        //$scope.badgeUrl="../images/badges/handshake.png";
        init();
      }
  });
