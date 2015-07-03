(function() {

angular.module('equip')

.controller('IMCtrl', function($scope, $rootScope, $firebaseArray, User, FirebaseFactory) {

  $scope.message = 'Hey everyone, I\m cool!';
  var userId = User.getCurrentUser().uid;
  var userData = FirebaseFactory.getObject(['users', userId], true);
  var finished = false;

  userData.$loaded().then(function() {
    $scope.currentUser = userData.displayName;
    getUserIds();
  });
});
})();

