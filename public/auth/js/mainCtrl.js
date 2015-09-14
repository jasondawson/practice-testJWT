angular.module('authJWT').controller('mainCtrl', function($scope, authService){

  $scope.$watch(authService.isLoggedIn, function (isLoggedIn){
    $scope.isLoggedIn = isLoggedIn;
    $scope.currentUser = authService.currentUser();
    console.log($scope.currentUser);
  });

});
