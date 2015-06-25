angular.module('equip')

.controller('CommonCtrl', function($scope, $rootScope, $location, $window, refUrl, FirebaseFactory) {

  var userId = FirebaseFactory.getCurrentUser().uid;

  var ref = new Firebase(refUrl);

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
    $location.path('/login');
  };

})