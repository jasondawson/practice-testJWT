(function() {

  angular
    .module('MainApp')
    .controller('mainCtrl', mainCtrl);

    function mainCtrl(mainService, $location, $window, $state) {
      var vm = this;

      // grab incoming bounce params and remove them from the url

      var bounceParams = JSON.parse($location.search().bounce || null);
      console.log(bounceParams);
      console.log($window.location)


      vm.login = function () {
        var redirect = bounceParams || null;
        console.log(redirect)
        var user = {
          email: vm.email,
          password: vm.password
        }
        mainService.login(user, redirect)
          .then(function(response) {
            if($window.localStorage.jwtoken) {
              $state.go('protectedContent')
            }
          })
      }

    }
})();
