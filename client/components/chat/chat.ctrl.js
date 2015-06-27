angular.module('equip')

.controller('ChatCtrl', function($scope, $rootScope, FirebaseFactory) {

  var userId = FirebaseFactory.getCurrentUser().uid;
  $scope.canSend = true;
  var lastMessageDate = 0;
  var userData = FirebaseFactory.getObject(['users', userId], true);

  $scope.addMessage = function() {
    var currentDate = new Date();
    var date = moment().format('YYYY-MM-DD hh:mm');
    var showImg = true;

    if (currentDate - lastMessageDate < 20000) {
      showImg = false;
    }
    if (!$rootScope.selectedTeam) {
      this.canSend = false;
    } else {
      this.canSend = true;
      $scope.messages.$add({
        displayImg: showImg,
        chatName: $scope.user,
        userImg: $scope.img,
        text: $scope.message,
        createdAt: date,
      });      
      lastMessageDate = currentDate;
    }

    this.message = '';
  };

  $rootScope.$watch('selectedTeam', function() {
    if ($rootScope.selectedTeam) {
      $scope.messages = FirebaseFactory.getCollection('messages');
      $scope.dashboardMessages = $scope.messages.$loaded().then(function(data) {
        $scope.dashboardMessages = data.slice(data.length - 5, data.length);
      });
      lastMessageDate = 0;
    }
  });

  userData.$loaded()
  .then(function() {
    $scope.user = userData.displayName;
    $scope.img = userData.imgUrl;
  })
});
