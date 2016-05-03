'use strict';

angular.module('quizRT')
  .directive('notificationData', ['$http',function($http) {
    return {
      restrict: 'E',
      template: '<a>{{notificationCount}}</a>',
      link: function postLink(scope, element, attrs) {
        $http.get('/notifications')
         .success(function(data, status, headers, config) {
              scope.notificationCount = data.length;
              scope.notificationData = data;
              console.log(data);

          })
        element.bind('click', function() {
        
          console.log(scope.notificationData);
        });
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
