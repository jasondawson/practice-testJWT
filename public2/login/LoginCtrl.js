(function() {

  angular
    .module('jwt')
    .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl () {

      var vm = this;
      vm.test = 'Login';

    }


})();
