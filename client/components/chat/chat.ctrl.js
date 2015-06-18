angular.module('equip')

.controller('ChatCtrl', function($scope, $firebaseArray) {
  var ref = new Firebase("https://mkseqip.firebaseIO.com");
  var chatMessages = $firebaseArray(ref);

  this.poster = "Test";
  this.messages = chatMessages;

  this.addMessage = function() {
    this.messages.$add({
      user: this.poster,
      message: this.post
    });

    this.message = "";
  };

  this.messages.$loaded(function() {
    console.log(this.messages);
    if (this.messages.length === 0) {
      this.messages.$add({
        user: "Emily",
        message: "HEY!"
      });
    }
  });
})
