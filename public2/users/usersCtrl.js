(function() {

  angular
    .module('jwt')
    .controller('UsersCtrl', UsersCtrl);

    function UsersCtrl () {
      var vm = this;

      vm.test = 'Users';

    }


})();
