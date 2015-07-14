(function() {

angular.module('equip')
.controller('CommonCtrl', function($scope, $rootScope, $location, $window, $anchorScroll, User, FirebaseFactory) {

  var userId = User.getCurrentUser().uid;
  $scope.usersTeams = FirebaseFactory.getCollection(['users', userId, 'teams'], true);
  var userData = FirebaseFactory.getObject(['users', userId], true);

  $rootScope.goToTop = function() {
    $location.hash('scrolltop');
    $anchorScroll();
  }

  userData.$watch(function() {
    $scope.name = userData.displayName;
    $scope.img = userData.imgUrl;
  });

  // set context for the team select element in home view
  // if there's already a team on the rootScope, set it to the selected team in the home view
  if ($rootScope.selectedTeam) {
    $scope.currentTeamOption = $rootScope.selectedTeam;
  }

/*
 * check for selected team in current scope once user's teams are loaded
 * then check local storage followed by rootScope => adjust local scope, rootScope,
 * and storage accordingly
 **/
  $scope.usersTeams.$loaded()
    .then(function() {
      if (!$scope.currentTeamOption) {
        if (localStorage.selectedTeam !== "null") {
          $scope.currentTeamOption = JSON.parse(localStorage.selectedTeam)
        } else {
          $scope.currentTeamOption = $scope.usersTeams[0];
          localStorage.selectedTeam = JSON.stringify($scope.currentTeamOption);
        }
        $rootScope.selectedTeam = $scope.currentTeamOption;
      } else {
        if ($rootScope.selectedTeam) {
          $scope.currentTeamOption = $rootScope.selectedTeam;
        } else {
          $scope.currentTeamOption = $scope.usersTeams[0];
          $rootScope.selectedTeam = $scope.currentTeamOption;
          localStorage.selectedTeam = JSON.stringify($scope.currentTeamOption);
        }
      }
    });

  $scope.changeContext = function() {
    $rootScope.selectedTeam = $scope.currentTeamOption;
    localStorage.selectedTeam = JSON.stringify($rootScope.selectedTeam);
  };

  $scope.signOut = function() {
    $window.localStorage.removeItem('equipAuth');
    localStorage.selectedTeam = null;
    $rootScope.selectedTeam = null;
    $location.path('/login');
  };
});
})();
