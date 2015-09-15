(function() {

  angular
    .module('MainApp')
    .service('mainService', mainService);

    function mainService($q, $window, $http) {

      this.login = function(user, redirectState) {
          var dfd = $q.defer();

          $http.post('/api/authenticate' + '?bounce=' + redirectState, user)
          .then(function(response) {
            console.log(response);
            if (response.data.jwtoken) {
              $window.localStorage.jwtoken = response.data.jwtoken;
              if(response.data.redirect) {
                $window.location.replace(response.data.redirect + '?jwtoken='+response.data.jwtoken);
              } else {
                dfd.resolve(response.data.redirect)
              }
            } else {
              console.log('error: no token')
            }
          });
          return dfd.promise;

      }
    }
})();
