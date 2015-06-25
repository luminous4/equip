angular.module('equip')

.controller('CommonCtrl', function($scope, $rootScope, $location, $window, refUrl, FirebaseFactory) {

  var userObj = $window.localStorage.getItem('firebase:session::mksequip');
  var userId = JSON.parse(userObj).uid;

  var ref = new Firebase(refUrl);

  $scope.usersTeams = FirebaseFactory.getCollection(['users', userId, 'teams'], true);

  $scope.usersTeams.$loaded()
  .then(function() {
    this.currentTeamOption = $scope.usersTeams[0];
    $rootScope.selectedTeam = this.currentTeamOption;
  });

  this.changeContext = function() {
    console.log("changedContext: ", this.currentTeamOption);
    $rootScope.selectedTeam = this.currentTeamOption;
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
    });
  }

  this.signOut = function() {
    $window.localStorage.removeItem('equipAuth');
    $location.path('/login');
  };

})