(function() {
   angular.module('equip')

  .controller('RegisterCtrl', function($scope, $firebaseAuth, $location, FirebaseFactory, User, refUrl) {
    var ref = new Firebase(refUrl);
    var authObj = $firebaseAuth(ref);

    $scope.success = true;
    $scope.teamJoin = true;
    $scope.teamCreate = true;

    $scope.register = function() {
      var teamAction;

      if ($scope.teamJoin === true){
        teamAction = 'join';
      } else {
        teamAction = 'create';
      }

      User.register($scope.email, $scope.password, $scope.teamName, teamAction, authObj, function(success) {
        if (!success) {
          $scope.success = false;
          $scope.email = '';
          $scope.password = '';
          $scope.teamName = '';
        }
      });
    };

    $scope.$watch('teamJoin', function() {
      if ($scope.teamJoin) {
        $scope.teamCreate = false;
      } else {
        $scope.teamCreate = true;
      }
    });

    $scope.$watch('teamCreate', function() {
        if ($scope.teamCreate) {
          $scope.teamJoin = false;
        } else {
          $scope.teamJoin = true;
        }
    });
  });
})();