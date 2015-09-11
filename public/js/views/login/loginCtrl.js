angular.module('testJWT').controller('loginCtrl', function($scope, authService){

  $scope.register = function(){
    $scope.user.role = 'admin';
    authService.register($scope.user).then(function(res){
      console.log(res);
    }, function(err){
      console.log(err);
    });
  };

});
