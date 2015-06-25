angular.module('equip')

  .controller('HomeCtrl', function($rootScope, $location, $window, $scope, User, FirebaseFactory) {

    if($rootScope.selectedTeam) {
      $scope.currentTeamOption = $rootScope.selectedTeam;
    }

    userId = FirebaseFactory.getCurrentUser().uid;

    $scope.usersTeams = FirebaseFactory.getCollection(['users', userId, 'teams'], true);

    $scope.usersTeams.$loaded()
      .then(function() {
        if (!$scope.currentTeamOption) {
          $scope.currentTeamOption = $scope.usersTeams[0];
          $rootScope.selectedTeam = $scope.currentTeamOption;      
        } else {
          $scope.currentTeamOption = $rootScope.selectedTeam;
        }
      });

    this.changeContext = function() {
      $rootScope.selectedTeam = $scope.currentTeamOption;
    };
  });