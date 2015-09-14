angular.module('clientJWT').service('authService', function($http, $q){

  var currentUser;
  this.login = login;
  this.getUser = getUser;

  function login(user){
    return $http({
      method: 'GET',
      url: '/auth',
      data: user
    }).then(function(res){
      currentUser = res.data;
      return res.data;
    }, function(err){
      return err;
    });
  };

  function getUser (){
    $http({
      method: 'GET',
      url: '/auth'
    }).then(function(res){
      currentUser = res.data;
    }, function(err){
      console.log(err);
    });
  };

  this.isLoggedIn = function(){
    return currentUser ? true : false;
  };

  this.currentUser = function(){
    return currentUser;
  };

});
