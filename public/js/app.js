angular.module('testJWT', ['ngRoute']).config(function($routeProvider){

  $routeProvider
    .when('/login', {
      templateUrl: 'js/views/login/login.html',
      controller: 'loginCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

});
