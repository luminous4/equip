(function() {
   angular.module('equip')

  .controller('LoginCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
    localStorage.selectedTeam = 'null';
    var ref = new Firebase(refUrl);
    var loginObj = $firebaseAuth(ref);

    $scope.success = true;
    $scope.loading = false;

    $scope.login = function() {
      $scope.loading = true;
      User.login($scope.email, $scope.password, loginObj, function(success) {
        if (!success) {
          $scope.success = false;
          $scope.loading = false;
          $scope.email = '';
          $scope.password = '';
        }
      });
    };
  });
})();
