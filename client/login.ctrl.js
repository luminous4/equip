(function() {
   angular.module('equip')

  .controller('LoginCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
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