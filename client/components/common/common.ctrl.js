angular.module('equip')

.controller('CommonCtrl', function($scope, $rootScope, $location, $window, refUrl, FirebaseFactory) {

  var userId = FirebaseFactory.getCurrentUser().uid;

  var ref = new Firebase(refUrl);

  if($rootScope.selectedTeam) {
    $scope.currentTeamOption = $rootScope.selectedTeam;
  }

  $scope.usersTeams = FirebaseFactory.getCollection(['users', userId, 'teams'], true);

  $scope.usersTeams.$loaded()
    .then(function() {
      if (!$scope.currentTeamOption) {
        $scope.currentTeamOption = JSON.parse(localStorage.selectedTeam) || $scope.usersTeams[0];
        $rootScope.selectedTeam = $scope.currentTeamOption;      
      } else {
        $scope.currentTeamOption = $rootScope.selectedTeam;
      }
    });

  this.changeContext = function() {
    $rootScope.selectedTeam = $scope.currentTeamOption;
    localStorage.selectedTeam = JSON.stringify($rootScope.selectedTeam);
  };


  var getFromFirebase = function(collection, firebase, cb) {
    firebase.child(collection).child(userId).once('value', function(data) {
      cb(data.val());
    });
  };

  if (!$scope.name && !$scope.img) {
    getFromFirebase('users', ref, function(data) {
      $scope.name = data.displayName;
      $scope.img = data.imgUrl;
      $scope.$apply();
    });
  }

  this.signOut = function() {
    $window.localStorage.removeItem('equipAuth');
    $rootScope.selectedTeam = undefined;
    $location.path('/login');
  };

})