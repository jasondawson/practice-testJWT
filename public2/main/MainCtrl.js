(function() {

  angular
    .module('jwt')
    .controller('MainCtrl', MainCtrl);

    function MainCtrl () {
      var vm = this;

      vm.test = 'Main';

    }


})();
