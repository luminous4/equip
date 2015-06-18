angular.module('equip')

.controller('ChatCtrl', function($scope, $firebaseArray) {
  var ref = new Firebase("https://mksequip.firebaseIO.com/messages");
  var chatMessages = $firebaseArray(ref);

  console.log(chatMessages);

  this.poster = "Test";
  $scope.messages = chatMessages;

  this.addMessage = function() {
    $scope.messages.$add({
      user: this.poster,
      message: this.message
    });

    this.message = "";
  };

  $scope.messages.$loaded(function() {
    if ($scope.messages.length === 0) {
      $scope.messages.$add({
        user: "Emily",
        message: "HEY!"
      });
    }
  });
})
