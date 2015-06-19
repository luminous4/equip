angular.module('equip')

.controller('ChatCtrl', function($scope, $firebaseArray, $firebaseObject, $window, User, refUrl) {

  var userObj = $window.localStorage.getItem('firebase:session::mksequip');
  var userId = JSON.parse(userObj).uid;

  var ref = new Firebase(refUrl);
  var chatMessages = $firebaseArray(ref.child("messages"));

  $scope.messages = chatMessages;

  this.addMessage = function() {
    var date = moment().format('YYYY-MM-DD hh:mm');
    $scope.messages.$add({
      chatName: this.user,
      text: this.message,
      createdAt: date
    });

    this.message = "";
  };

  $scope.messages.$loaded(function() {
    console.log("Messages fetched succesfully");
  });
})
