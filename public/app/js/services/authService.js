angular.module('clientJWT').service('authService', function($http, $q){

  var currentUser;
  this.login = login;
  this.getUser = getUser;

  function login(user){
    var dfd = $q.defer();
    $http({
      method: 'GET',
      url: '/auth',
      data: user
    }).then(function(res){
      currentUser = res.data;
      dfd.resolve(res.data);
    }, function(err){
      dfd.reject(err);
    });
    return dfd.promise;
  };

  function getUser (){
    $http({
      method: 'GET',
      url: '/auth'
    }).then(function(res){
      currentUser = res.data;
    }, function(err){
      currentUser = false;
      console.log(err);
    });
  };

  this.isLoggedIn = function(){
    return currentUser ? true : false;
  };

  this.currentUser = function(){
    return currentUser;
  };

  getUser();

});
