angular.module('equip')

  .controller('RegisterCtrl', function($scope, $firebaseAuth, $location, FirebaseFactory, User, refUrl) {
    var ref = new Firebase(refUrl);
    var authObj = $firebaseAuth(ref);

    $scope.success = true;

    $scope.register = function() {
      // console.log('just clicked register button');
      User.register($scope.email, $scope.password, authObj, function(success) {
        if (!success) {
          $scope.success = false;
          $scope.email = '';
          $scope.password = '';
        }
      });
    };
  })