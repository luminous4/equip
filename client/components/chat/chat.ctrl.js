(function() {

angular.module('equip')
.factory('Messages', function($firebaseArray) {
  return $firebaseArray.$extend({
    formatMessages: function() {
      if (this.$list.length) {
        var lastAuthor = this.$list[0].chatName;
      }
      var lastChatTime = 0;
      for (var i = 0; i < this.$list.length; i++) {
        var messageTime = new Date(this.$list[i].createdAt);
        console.log('interval: ', messageTime - lastChatTime);
        console.log('this messages author: ', this.$list[i].chatName);
        console.log('last Author: ', lastAuthor);
        if (messageTime - lastChatTime < 20000 && this.$list[i].chatName === lastAuthor) {
          this.$list[i]['showImg'] = false;
        } else {
          this.$list[i]['showImg'] = true;
        }
        lastAuthor = this.$list[i].chatName;
        lastChatTime = this.$list[i].createdAt;
      }
    }
  });
})

.controller('ChatCtrl', function($scope, $rootScope, $firebaseArray, Messages, User, FirebaseFactory) {

  var userId = User.getCurrentUser().uid;
  var userData = FirebaseFactory.getObject(['users', userId], true);
  $scope.canSend = true;
  $scope.lastAuthor = $scope.user;
  $scope.showedPic = false;

  $rootScope.$watch('selectedTeam', function() {
    if ($rootScope.selectedTeam) {
      var ref = new Firebase('https://mksequip.firebaseio.com/teams/');
      $scope.messages = new Messages(ref.child($rootScope.selectedTeam.$value).child('messages'));
      $scope.messages.$loaded()
      .then(function() {
        $scope.messages.formatMessages();
        $scope.messages.$watch(function() {
          $scope.messages.formatMessages();
        });
      });
    }
  });

  userData.$loaded()
  .then(function() {
    $scope.user = userData.displayName;
    $scope.img = userData.imgUrl;
  });

  $scope.addMessage = function() {
    if (!$rootScope.selectedTeam) {
      this.canSend = false;
    } else {
      this.canSend = true;
      $scope.messages.$add({
        chatName: $scope.user,
        userImg: $scope.img,
        text: $scope.message,
        createdAt: Firebase.ServerValue.TIMESTAMP
      });      
    }

    this.message = '';
  };
});
})();

