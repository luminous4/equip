angular.module('equip')

.controller('CommonCtrl', function($scope, $rootScope, $location, $window, refUrl, FirebaseFactory) {

  var userId = FirebaseFactory.getCurrentUser().uid;

  if($rootScope.selectedTeam) {
    $scope.currentTeamOption = $rootScope.selectedTeam;
  }

  $scope.usersTeams = FirebaseFactory.getCollection(['users', userId, 'teams'], true);

  $scope.usersTeams.$loaded()
    .then(function() {
      if (!$scope.currentTeamOption) {
        if (localStorage.selectedTeam !== "undefined") {
          $scope.currentTeamOption = JSON.parse(localStorage.selectedTeam)
        } else {
          $scope.currentTeamOption = $scope.usersTeams[0];
        }
        $rootScope.selectedTeam = $scope.currentTeamOption;      
      } else {
        $scope.currentTeamOption = $rootScope.selectedTeam;
        localStorage.selectedTeam = JSON.stringify($rootScope.selectedTeam);
      }
    });

  this.changeContext = function() {
    $rootScope.selectedTeam = $scope.currentTeamOption;
    localStorage.selectedTeam = JSON.stringify($rootScope.selectedTeam);
  };

  var userData = FirebaseFactory.getObject(['users', userId], true);

  userData.$watch(function() {
    $scope.name = userData.displayName;
    $scope.img = userData.imgUrl;
  });


  this.signOut = function() {
    $window.localStorage.removeItem('equipAuth');
    localStorage.selectedTeam = null;
    $rootScope.selectedTeam = null;
    $location.path('/login');
  };

})