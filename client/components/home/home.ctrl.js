angular.module('equip')

  .controller('HomeCtrl', function($rootScope, $location, $window, $scope, User) {

    $rootScope.signOut = function() {
      $window.localStorage.removeItem('equipAuth');
      $location.path('/login');      
    };
  })