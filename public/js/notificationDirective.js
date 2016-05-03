'use strict';
//  scope:{notificationCount:"="},
angular.module('quizRT')
  .directive('notificationData', ['$http', function($http) {
    return {
      restrict: 'E',
      template: '<a ng-click="showModal()">{{notificationCount}}</a>',

      link: function postLink(scope, element, attrs) {
        $http.get('/notifications')
          .success(function(data, status, headers, config) {
            scope.notificationCount = data.length;
            scope.$root.notificationCount = data.length;
            scope.notificationData = data;
            console.log(data);

          })
          scope.showModal = function(){
            //show the modal
          }
        // element.bind('click', function() {
  //
  //   console.log(scope.notificationData);
  // });
        // attrs.$observe('notificationData',function(newVal){
        //   var newSign = parseFloat(newVal);
        //   if(newSign>0){
        //     element[0].style.color='Green';
        //   }else{
        //       element[0].style.color='Red';
        //   }
        // });
      }
    };
  }]);
