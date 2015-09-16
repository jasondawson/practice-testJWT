angular.module('authJWT').service('authService', function($http, $q, $routeParams, $window){

  var currentUser;
  this.login = login;

  function login(user){
    return $http({
      method: 'POST',
      url: '/api/authenticate',
      data: user
    }).then(function(res){
      currentUser = res.data;
      if($routeParams.callbackurl){
        $window.location.href = $routeParams.callbackurl + '?token=' + res.data.token;
      }
      return res.data;
    }, function(err){
      return err;
    });
  };

  this.register = function(user){
    //user has key of email, password, and role
    return $http({
      method: 'POST',
      url: '/api/signup',
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

  this.isLoggedIn = function(){
    return currentUser ? true : false;
  };

  this.currentUser = function(){
    return currentUser;
  };

});
