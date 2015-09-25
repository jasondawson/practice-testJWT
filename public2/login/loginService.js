(function() {

  angular
    .module('jwt')
    .service('loginService', loginService)
    .service('AuthToken', AuthToken)
    .factory('AuthInterceptor', AuthInterceptor);

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

    function AuthToken ($window) {
      this.getToken = function() {
        return $window.localStorage.getItem('jwtoken');
      }
      this.setToken = function(token) {
        if (token) {
          $window.localStorage.setItem('jwtoken', token);
        } else $window.localStorage.removeItem('jwtoken');
      }
    }

    function AuthInterceptor($q, $location, AuthToken) {
      var interceptorFactory = {};

      interceptorFactory.request = function(config) {
        var token = AuthToken.getToken();
        if (token) {
          config.headers['x-access-token'] = token
        }
        return config;
      };

      return interceptorFactory;
    }

})();
