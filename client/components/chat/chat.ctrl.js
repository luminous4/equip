angular.module('equip')

.controller('ChatCtrl', function($scope, $rootScope, $firebaseArray, $location, $window, User, refUrl, FirebaseFactory) {

  var userId = FirebaseFactory.getCurrentUser().uid;

  var ref = new Firebase(refUrl);

  $rootScope.$watch('selectedTeam', function() {
    if ($rootScope.selectedTeam) {
      $scope.messages = FirebaseFactory.getCollection('messages');
    }
  });

  var getFromFirebase = function(collection, firebase, cb) {
    firebase.child(collection).child(userId).once('value', function(data) {
      cb(data.val());
    });
  };

  getFromFirebase('users', ref, function(data) {
    $scope.user = data.displayName;
    $scope.img = data.imgUrl;
  });

  this.addMessage = function() {
    var date = moment().format('YYYY-MM-DD hh:mm');
    $scope.messages.$add({
      chatName: $scope.user,
      userImg: $scope.img,
      text: this.message,
      createdAt: date
    });

    this.message = '';
  };

})
