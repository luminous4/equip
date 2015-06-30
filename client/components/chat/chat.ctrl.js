(function() {

angular.module('equip')
.controller('ChatCtrl', function($scope, $rootScope, FirebaseFactory) {

  var userId = FirebaseFactory.getCurrentUser().uid;
  var userData = FirebaseFactory.getObject(['users', userId], true);
  $scope.canSend = true;
    $scope.lastAuthor = $scope.user;
  $scope.showedPic = false;

  $rootScope.$watch('selectedTeam', function() {
    if ($rootScope.selectedTeam) {
      $scope.messages = FirebaseFactory.getCollection('messages');
      $scope.messages.$loaded()
      .then(function(data) {
        $scope.dashboardMessages = data.slice(data.length - 5, data.length);
      })
    }
  });

  userData.$loaded()
  .then(function() {
    $scope.user = userData.displayName;
    $scope.img = userData.imgUrl;
  });

  $scope.showImg = function(currMessageDate, currMessageName) {
    var messageDate = new Date(currMessageDate);
    var showPic = true;
    var interval = messageDate - $scope.lastMessageDate;
    if (interval < 20000 && $scope.lastAuthor === currMessageName) {
      $scope.showedPic = false;
      showPic = false;
    } else {
      $scope.showedPic = true;
      showPic = true;      
    }
    $scope.lastAuthor = currMessageName;
    $scope.lastMessageDate = new Date(currMessageDate);
    return showPic;
  }


  $scope.addMessage = function() {
    var currentDate = new Date();
    currentDate = currentDate.toString();
    if (!$rootScope.selectedTeam) {
      this.canSend = false;
    } else {
      this.canSend = true;
      $scope.messages.$add({
        chatName: $scope.user,
        userImg: $scope.img,
        text: $scope.message,
        createdAt: currentDate,
      });      
    }

    this.message = '';
  };
});
})();

