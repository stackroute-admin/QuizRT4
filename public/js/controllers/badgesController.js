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
    .controller('badgesController',function($http,$scope,$rootScope,$location){

      // redirect to login page if the user's isAuthenticated cookie doesn't exist
      if( !$rootScope.isAuthenticatedCookie ){
        $rootScope.logInLogOutErrorMsg = 'You are logged out. Kindly Login...';
        $rootScope.logInLogOutSuccessMsg = '';
        $location.path('/login');
      } else {
        $rootScope.hideFooterNav = false;
        $rootScope.stylesheetName="";
        $scope.badgeUrl="../images/badges/handshake.png";
        $scope.badgeArr=[1,2,3,4,5,6,7];
        $scope.badgeArr1=[
            {
                badgeHeader : "Badge Header 1",
                badgeDesc : "Badge Description 1",
                badgeUrl: $scope.badgeUrl
            },
            {
                badgeHeader : "Badge Header 2",
                badgeDesc : "Badge Description 2",
                badgeUrl: $scope.badgeUrl
            },
            {
                badgeHeader : "Badge Header 3",
                badgeDesc : "Badge Description 3",
                badgeUrl: $scope.badgeUrl
            },
            {
                badgeHeader : "Badge Header 4",
                badgeDesc : "Badge Description 4",
                badgeUrl: $scope.badgeUrl
            },
            {
                badgeHeader : "Badge Header 5",
                badgeDesc : "Badge Description 5",
                badgeUrl: $scope.badgeUrl
            },
            {
                badgeHeader : "Badge Header 6",
                badgeDesc : "Badge Description 6",
                badgeUrl: $scope.badgeUrl
            },
            {
                badgeHeader : "Badge Header 7",
                badgeDesc : "Badge Description 7",
                badgeUrl: $scope.badgeUrl
            }
        ];
      }
  });
