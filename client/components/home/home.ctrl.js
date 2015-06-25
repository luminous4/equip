angular.module('equip')

  .controller('HomeCtrl', function($rootScope, $location, $window, $scope, User, FirebaseFactory) {

    if($rootScope.selectedTeam) {
      $scope.currentTeamOption = $rootScope.selectedTeam;
    }

    userId = FirebaseFactory.getCurrentUser().uid;

    $scope.usersTeams = FirebaseFactory.getCollection(['users', userId, 'teams'], true);

    $scope.usersTeams.$loaded()
      .then(function() {
        $scope.currentTeamOption = $rootScope.selectedTeam;
      });

    this.changeContext = function() {
      console.log("changedContext: ", $scope.currentTeamOption);
      $rootScope.selectedTeam = $scope.currentTeamOption;
    };


  })