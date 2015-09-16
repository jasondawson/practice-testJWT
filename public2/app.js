(function() {

  angular
    .module('jwt', ['ui.router'])
    .config(config)
    .run(run);

    function config($stateProvider, $urlRouterProvider, $httpProvider) {

      $urlRouterProvider.otherwise('/');

      $httpProvider.interceptors.push('AuthInterceptor');

      $stateProvider
        .state('welcome', {
          url: '/',
          templateUrl: 'welcome/welcome.html',
        })
        .state('main', {
          url: '/main',
          templateUrl: 'main/main.html',
          controller: 'MainCtrl',
          controllerAs: 'vm'
        })
        .state('users', {
          url: '/users',
          templateUrl: 'users/users.html',
          controller: 'UsersCtrl',
          controllerAs: 'vm'
        })

    } //end config

    function run($rootScope, $state, $window, loginService, $location) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        // console.log(event);
        //event.preventDefault();
        // console.log(toState)
        if ($window.localStorage.jwtoken) {
          $rootScope.loggedIn = true;
        } else {
          $rootScope.loggedIn = false;
        }

        if(toState.name === 'welcome') {
          return true;
        } else {
          // event.preventDefault();
          if($location.search().jwtoken) {
            $window.localStorage.jwtoken = $location.search().jwtoken;
            $rootScope.loggedIn = true;
            console.log($location.search().jwtoken);
          }
          // alert($window.localStorage.jwtoken);
          if(!$window.localStorage.jwtoken) {
            event.preventDefault();
            console.log('no token');
            var bounceState = toState.name;
            // console.log(bounceUrl)
            loginService.getToken('devkittens', bounceState).then(function(response) {
              if (response.jwtoken) {
                $window.localStorage.token = response.jwtoken;
                $rootScope.loggedIn = true;
                //TODO navigate back to toState.name
              } else if (response.redirect) {
                $window.location.replace(response.redirectUrl);
              }
              console.log(response)
            });
          } else {
            // $state.go(toState);
          }
        }
      })
    }

})();
