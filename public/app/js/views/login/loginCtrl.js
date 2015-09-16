angular.module('clientJWT').controller('loginCtrl', function($window, $scope, authService){

  $scope.register = function(){
    $scope.user.role = 'admin';
    authService.register($scope.user).then(function(res){
      console.log(res);
    }, function(err){
      console.log(err);
    });
  };

  $scope.login = function(){
    var callbackurl = 'http://localhost:8080/authfromserver2?callbackurl=http://localhost:8081/authcallback';
    authService.login($scope.user).then(function(res){
      console.log(res);
    }, function(err){
      console.log(err);
      $window.location.href = callbackurl;
    });
  };

});
