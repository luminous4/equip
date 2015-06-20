angular.module('equip')

.controller('ChatCtrl', function($scope, $firebaseArray, $location, $anchorScroll, $window, User, refUrl) {

  var userObj = $window.localStorage.getItem('firebase:session::mksequip');
  var userId = JSON.parse(userObj).uid;


  var ref = new Firebase(refUrl);
  var chatMessages = $firebaseArray(ref.child("messages"));

  $scope.messages = chatMessages;

  var getUser = function(fb, cb) {
    fb.child('users').child(userId).once("value", function(data) {
      cb(data.val().displayName, data.val().imgUrl);
    });
  };

  getUser(ref, function(name, img) {
    $scope.user = name;
    $scope.img = img;
  });

  this.addMessage = function() {
    var date = moment().format('YYYY-MM-DD hh:mm');
    $scope.messages.$add({
      chatName: $scope.user,
      userImg: $scope.img,
      text: this.message,
      createdAt: date
    });

    this.message = "";
  };

  var scrollToBottom = function() {
    $location.hash('chat-bottom');
    $anchorScroll();
  };

  $scope.messages.$loaded(function() {
    console.log("Messages fetched succesfully");
    scrollToBottom();
  });
})
