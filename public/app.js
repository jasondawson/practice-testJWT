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
        template: '<div>Public Content! </div>'
      })
      .state('welcome', {
        url: '/',
        template: '<div>Welcome to Terraform Mars!</div>'
      })
      .state('protectedContent', {
        url: '/protectedContent',
        template: '<div> Login Successful </div>'
      })
  }

  function run ($rootScope, $state, $window) {
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      if(toState.name === 'welcome') {
        $rootScope.loggedIn = false;
        delete $window.localStorage.jwtoken;
      }
      console.log(toState)
      console.log(toState.name);
      console.log($window.localStorage.jwtoken);
      console.log(toState.name === 'protectedContent' && !$window.localStorage.jwtoken)
      if (toState.name === 'protectedContent' && !$window.localStorage.jwtoken) {
        event.preventDefault();
        $state.go('login');
      }
    })
  }

})();
