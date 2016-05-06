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
//   Name of Developers  Raghav Goel, Kshitij Jain, Lakshay Bansal, Ayush Jain, Saurabh Gupta, Akshay Meher
//                        + Anil Sawant

angular.module('quizRT', ['ngRoute', 'ngCookies'])
    .run(function($cookies,$rootScope,$http,$location,socket) {

    $rootScope.initializeSockets = function() {
      console.log('Initializing sockets...');
      $rootScope.socket = socket($rootScope, '/normalGame'); // to use it through out the app
      $rootScope.tournamentSocket = socket($rootScope, '/tournament'); // to use it through out the app
      $rootScope.notificationSocket = socket($rootScope, '/notification');
    }

    // redirect to user-profile page if the user's cookie exists
    if ($cookies.get('isAuthenticated')) {
      $location.path('/userProfile');
      $rootScope.initializeSockets();
    }

    // Add app level variables here
    $rootScope.stylesheetName = "index"; // name of the css stylesheet to be used while loading the app
    $rootScope.isAuthenticatedCookie = $cookies.get('isAuthenticated');
    $rootScope.logInLogOutSuccessMsg = ''; // used on login.html page to display login/logout status msgs
    $rootScope.logInLogOutErrorMsg = '';
    $rootScope.serverErrorMsg = 'Error! Kindly check your URL.'; // used in error.html to display Error message received from the server
    $rootScope.hideFooterNav = false; // This is used to hide the footer nav
    $rootScope.recentGames = {}; // save the recent games played by the user since last login. Saved as {gameId:gameBoard}
    $rootScope.playGame = {
      levelId: "",
      topicId: "",
      topicName: "",
      tournamentTitle: ""
    }; // used to pass topic/tournament details to quizPlayerController/tournamentPlayController

    // Added application level watcher here
    $rootScope.$watch('isAuthenticatedCookie', function(nv, ov) { // watch that puts/removes cookie based on $rootScope.isAuthenticatedCookie
      if (nv) {
        var now = new Date(),
          exp = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()); // this will set the expiration to 12 months
        $cookies.put('isAuthenticated', true, {
          expires: exp
        });
      } else {
        $cookies.remove('isAuthenticated');
      }
    });
    $rootScope.$watch('hideFooterNav', function(nv, ov) {
      if (nv) {
        $('#footer-nav').slideUp();
      } else {
        $('#footer-nav').slideDown();
      }
    });

    // Add app level events here
    $rootScope.$on('login', function(event) {
      $location.path('/login');
    });

    $rootScope.$on('logout', function(event, user) {
      console.log('Hey ' + user.name + "!, you will be logged out.");
      $rootScope.tournamentSocket.emit('logout', function(status) {
        console.log('Logged out of tournament.');
      });
      $rootScope.socket.emit('logout', $rootScope.loggedInUser.userId, function(status) {
        console.log('Disconnecting sockets...');
        if ($rootScope.socket) {
          $rootScope.socket.disconnect();
        } else {
          console.log('NormalSocket not found!!');
        }
        if ($rootScope.tournamentSocket) {
          $rootScope.tournamentSocket.disconnect();
        } else {
          console.log('Tournament Socket not found!!');
        }
        $cookies.remove('isAuthenticated');
        $rootScope.loggedInUser = null;
        $rootScope.isAuthenticatedCookie = false;
        $rootScope.logInLogOutErrorMsg = '';
        $rootScope.logInLogOutSuccessMsg = 'Logged out successfully!';
        $location.path('/login');
      });
    });

    $rootScope.redirectTo = function(location) {
      $location.path("/" + location);
    };
  })
  .factory('socket', function($rootScope) {
    return function($rootScope, type) {
       var socket = io.connect('http://172.23.238.151:8080' + type, {'forceNew':true } );
      /*var socket = io.connect('http://127.0.0.1:8080' + type, {
      // var socket = io.connect('http://192.168.0.103:8082' + type, {'forceNew':true } );
      // var socket = io.connect('http://172.23.238.216:7071' + type, {'forceNew':true } );

      var socket = io.connect('http://172.23.238.151:8080'  + type, {
        'forceNew': true
      });*/
      // var socket = io.connect('http://quizart.stackroute.in:2000' + type, {'forceNew':true } );
      console.log('Socket initialized for ' + type);

        return {
          on: function (eventName, callback) {
           socket.on(eventName, function () {
           var args = arguments;
           $rootScope.$apply(function () {
             callback.apply(socket, args);
            });
          });
        },
        once: function(eventName, callback) {
          socket.once(eventName, function() {
            var args = arguments;
            $rootScope.$apply(function() {
              callback.apply(socket, args);
            });
          });
        },
        emit: function(eventName, data, callback) {
          socket.emit(eventName, data, function() {
            var args = arguments;
            $rootScope.$apply(function() {
              if (callback) {
                callback.apply(socket, args);
              }
            });
            })
          },
          disconnect: function() {
            socket.disconnect();
          }
         };
      }})
     .config(function($routeProvider){
       $routeProvider
        .when('/404',{
          'templateUrl' : 'html/404.html'
        })
        .when('/error',{
          'templateUrl' : 'html/error.html'
        })
        .when('/',{
          'templateUrl' : 'html/login.html',
          'controller':'authController'
        })
        .when('/login', {
          'templateUrl': 'html/login.html',
          'controller':'authController'
        })
        .when('/locallogin', {
          'templateUrl': 'html/locallogin.html',
          'controller': 'authController'
        })
        .when('/register', {
          'templateUrl': 'html/register.html',
          'controller': 'authController'
        })
        .when('/userProfile',{
          'templateUrl': 'html/userProfile.html',
          'controller': 'userProfileController'
        })
        .when('/userTeams',{
          'templateUrl': 'html/userTeams.html',
          'controller': 'userProfileController'
        })
        .when('/userTournaments',{
          'templateUrl': 'html/userTournaments.html',
          'controller': 'userProfileController'
        })
        .when('/userSettings',{
          'templateUrl': 'html/userSettings.html',
          'controller': 'userSettingsController'
        })
        .when('/categories',{
          'templateUrl': 'html/categories.html',
          'controller': 'categoriesController'
        })
        .when('/category/:categoryID',{
          'templateUrl': 'html/category.html',
          'controller': 'categoryController'
        })
        .when('/topic/:topicId',{
          'templateUrl': 'html/topic.html',
          'controller': 'topicController'
        })
        .when('/quizPlayer',{
          'templateUrl': 'html/quizPlayer.html',
          'controller': 'quizPlayerController',
          'reload':true
        })
        .when('/quizPlayer/:topicName/:topicId/:urlId',{
          'templateUrl': 'html/quizPlayer.html',
          'controller': 'quizPlayerController',
          'reload':true
        })
        .when('/tournamentArena',{
          'templateUrl': 'html/tournamentArena.html',
          'controller': 'tournamentPlayController',
          'reload':true
        })
        .when('/quizResult/:gameId',{
          'templateUrl': 'html/result.html',
          'controller': 'resultController'
        })
        .when('/tournament',{
          'templateUrl': 'html/tournamentLists.html',
          'controller': 'tournamentController'
        })
        .when('/tournament/:tournamentId' , {
          'templateUrl': 'html/tournament.html',
          'controller': 'tournamentController'
        })
        .when('/tournament/tournamentPlayer' , {
          'templateUrl': 'html/tournamentPlayer.html',
          'controller': 'tournamentPlayerController'
        })
        .when('/userProfile',{
          'templateUrl': 'html/userProfile.html',
          'controller': 'userProfileController'
        })
        .when('/userTeams',{
          'templateUrl': 'html/userTeams.html',
          'controller': 'userProfileController'
        })
        .when('/userTournaments',{
          'templateUrl': 'html/userTournaments.html',
          'controller': 'userTournamentsController'
        })
        .when('/userSettings',{
          'templateUrl': 'html/userSettings.html',
          'controller': 'userSettingsController'
        })
        .when('/categories',{
          'templateUrl': 'html/categories.html',
          'controller': 'categoriesController'
        })
        .when('/category/:categoryID',{
          'templateUrl': 'html/category.html',
          'controller': 'categoryController'
        })
        .when('/topic/:topicID',{
          'templateUrl': 'html/topic.html',
          'controller': 'topicController'
        })
        .when('/quizPlayer',{
          'templateUrl': 'html/quizPlayer.html',
          'controller': 'quizPlayerController',
          'reload':true
        })
        .when('/tournament/tournamentPlayer' , {
          'templateUrl': 'html/tournamentPlayer.html',
          'controller': 'tournamentPlayerController'
        })
        .when('/leaderBoard/hallOfFame/:tournamentId' , {
          'templateUrl': 'html/hallOfFame.html',
          'controller': 'halloffameController'
        })
        .when('/createTournament' , {
          'templateUrl': 'html/tournamentCreation.html',
          'controller': 'tournamentCreationController'
        })
        .when('/createConfTournament' , {
          'templateUrl': 'html/createConfTournament.html',
          'controller': 'tournamentCreationController'
        })
        .when('/inviteFriends', {
          'templateUrl': 'html/inviteFriends.html',
          'controller': 'inviteFriendsController'
        })
        .when('/friendUserProfile/:userId', {
          'templateUrl': 'html/friendUserProfile.html',
          'controller': 'userProfileController'
        })
        .when('/notifications', {
          'templateUrl': 'html/notifications.html',
          'controller': 'notificationController'
        })
        .otherwise({
          redirectTo : '/'
        });
    });
