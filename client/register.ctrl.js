(function() {
   angular.module('equip')

  .controller('RegisterCtrl', function($scope, $firebaseAuth, $location, FirebaseFactory, User, refUrl) {
    var ref = new Firebase(refUrl);
    var authObj = $firebaseAuth(ref);

    $scope.userSuccess = true;
    $scope.teamSuccess = true;
    $scope.teamJoin = true;
    $scope.teamCreate = true;
    $scope.loading = false;

    $scope.register = function() {
      $scope.loading = true;
      var teamAction;

      if ($scope.teamJoin === true){
        teamAction = 'join';
      } else {
        teamAction = 'create';
      }

      User.register($scope.email, $scope.password, $scope.teamName, teamAction, authObj, function(userSaved, teamNotFound, teamAlreadyExists) {
        $scope.loading = false;

        if (!userSaved) {
          $scope.userSuccess = false;
          $scope.email = '';
          $scope.password = '';
          $scope.teamName = '';
        }

        if (teamNotFound) {
          $scope.teamSuccess = false;
          $scope.msg = ('Team not found');
          $scope.teamName = '';
        }

        if (teamAlreadyExists) {
          $scope.teamSuccess = false;
          $scope.msg = ('Team already exists');
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