angular.module('clientJWT').service('authService', function($http, $q){

  var currentUser;
  this.login = login;
  this.getUser = getUser;

  function login(user){
    return $http({
      method: 'POST',
      url: 'http://localhost:8081/api/server2Authenticate',
      data: user
    }).then(function(res){
      currentUser = res.data;
      return res.data;
    }, function(err){
      return err;
    });
  };

  this.register = function(user){
    //user has key of email, password, and role
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/api/signup',
      data: user
    }).then(function(res){
      login(user).then(function(res){
        return res.data;
      }, function(err){
        return err;
      })
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
