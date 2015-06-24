angular.module('equip')

  .controller('LoginCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
    var ref = new Firebase(refUrl);
    var loginObj = $firebaseAuth(ref);

    $scope.success = true;

    $scope.login = function() {
      console.log('just clicked login button');
      User.login($scope.email, $scope.password, loginObj, function(success) {
        if (!success) {
          $scope.success = false;
          $scope.email = '';
          $scope.password = '';
        }
      });
    };
  })