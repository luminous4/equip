angular.module('equip')

.controller('ChatCtrl', function($scope, $rootScope, $firebaseArray, $location, $window, User, refUrl, FirebaseFactory) {

  var userId = FirebaseFactory.getCurrentUser().uid;
  var ref = new Firebase(refUrl);

  this.canSend = true;
  var lastMessageDate = 0;

  $rootScope.$watch('selectedTeam', function() {
    if ($rootScope.selectedTeam) {
      $scope.messages = FirebaseFactory.getCollection('messages');
      lastMessageDate = 0;
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
    var currentDate = new Date();
    console.log("lastMessageDate: ", lastMessageDate);
    console.log("current date: ", currentDate);
    var showImg = true;
    if (currentDate - lastMessageDate < 20000) {
      console.log("been less than 20000 ms: ", currentDate - lastMessageDate);
      showImg = false;
    }
    var date = moment().format('YYYY-MM-DD hh:mm');
    if (!$rootScope.selectedTeam) {
      this.canSend = false;
    } else {
      $scope.messages.$add({
        displayImg: showImg,
        chatName: $scope.user,
        userImg: $scope.img,
        text: this.message,
        createdAt: date,
      });      
    }
    lastMessageDate = currentDate;
    console.log("new lastMessageDate: ", lastMessageDate);
    this.message = '';
  };

})
