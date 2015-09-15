(function() {

  angular
    .module('jwt')
    .service('loginService', loginService);

    function loginService ($q, $http) {

      this.getToken = function(app, destination) {
        var dfd = $q.defer();
        console.log(destination);
        $http.get('/api/getToken/' + app + '/' + destination).then( function(response) {
          console.log('get token');
          console.log(response.data);
          dfd.resolve(response.data);
        })
        return dfd.promise;
      }
    }


})();
