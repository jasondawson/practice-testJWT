(function(){

angular
  .module('MainApp', ['ui.router'])
  .config(config)
  .run(run);

  function config ($stateProvider, $urlRouterProvider, $locationProvider, $provide) {

    $locationProvider.html5Mode(true).hashPrefix('/');

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'main/mainView.html',
        controller: 'mainCtrl',
        controllerAs: 'vm'
      })
      .state('content', {
        url: '/content',
        template: '<div class="container"><h2>Public Content!</h2></div>'
      })
      .state('welcome', {
        url: '/',
        template: '<div class="container"><h2>Welcome to Terraform Mars!</h2></div>'
      })
      .state('protectedContent', {
        url: '/protectedContent',
        template: '<div class="container"><h2> Login Successful</h2></div>'
      })
  }

  function run ($rootScope, $state, $window) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
       if ($window.localStorage.jwtoken) {
          $rootScope.loggedIn = true;
        } else {
          $rootScope.loggedIn = false;
        }
      if(toState.name === 'welcome') {
        return true;
      }
      console.log(toState)
      console.log(toState.name);
      console.log($window.localStorage.jwtoken);
      console.log(toState.name === 'protectedContent' && !$window.localStorage.jwtoken)
      if (toState.name === 'protectedContent' && !$window.localStorage.jwtoken) {
        event.preventDefault();
        $state.go('login');
      } else if ($window.localStorage.jwtoken) {
        $rootScope.loggedIn = true;
      }
    })
  }

})();
