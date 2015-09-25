(function() {

  angular
    .module('MainApp')
    .controller('authCtrl', authCtrl);

    function authCtrl ($rootScope, $window, $state) {
      var vm = this;

      vm.logout = function() {
        $rootScope.loggedIn = false;
        delete $window.localStorage.jwtoken;
        $state.go('welcome');
      }

    }
})();

