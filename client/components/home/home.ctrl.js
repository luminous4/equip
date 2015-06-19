angular.module('equip')

  .controller('homeCtrl', function($scope, $state, $stateParams) {
    if(!$stateParams.authData) {
      $state.go('login');
    }
  })