(function() {

angular.module('equip')

.controller('IMCtrl', function($scope, $rootScope, $firebaseArray, User, FirebaseFactory) {

  var userId = User.getCurrentUser().uid;
  var userData = FirebaseFactory.getObject(['users', userId], true);
  var interimFriends = [];
  $scope.allFriendsIds = [];
  $scope.allFriends = [];
  $scope.selectedFriend = null;
  $scope.messages = [];

  userData.$loaded().then(function() {
    $scope.currentUser = userData.displayName;
    getAllTeamUsers();
  });

  var getTeamUsers = function(team, last, callback) {
    var interimTeam = FirebaseFactory.getObject(['teams', team], true);
    interimTeam.$loaded().then(function() {
      for (key in interimTeam.users) {
        interimFriends.push(interimTeam.users[key]);
      }
      if (last) {
        callback(interimFriends);
      }
    });
  };

  var getAllTeamUsers = function() {
    var teamArray = [];
    var lastTeam = false;
    for (key in userData.teams) {
      teamArray.push(userData.teams[key]);
    };

    for (var i = 0; i < teamArray.length; i++) {
      if (i === teamArray.length - 1) lastTeam = true;
      getTeamUsers(teamArray[i], lastTeam, formatUserArray);
    }
  };

  var formatUserArray = function(friendsIds) {
    var uniqHash = {};
    for (var i = 0; i < friendsIds.length; i++) {
      uniqHash[friendsIds[i]] = true;
    };
    delete uniqHash[userId];

    $scope.allFriendsIds = Object.keys(uniqHash);
  }

  var getFriendObject = function(friend) {
    var friendObject = FirebaseFactory.getObject(['users', friend], true);
    friendObject.$loaded().then(function() {
      $scope.allFriends.push(friendObject);
    });
  };

  var getAllFriendObjects = function() {
    for (var i = 0; i < $scope.allFriendsIds.length; i++) {
      getFriendObject($scope.allFriendsIds[i]);
    }
  };

  $scope.$watch('allFriendsIds', getAllFriendObjects);

  $scope.loadMessages = function(event) {
    $scope.clickedUser = event.target.dataset.clickId;
    $scope.clickedUserName = event.target.dataset.clickName;
    $scope.tab2 = true; 
    $scope.tab1 = false;
    $scope.myMessages = FirebaseFactory.getCollection(['users', userId, 'instantMessages', $scope.clickedUser], true);
    $scope.theirMessages = FirebaseFactory.getCollection(['users', $scope.clickedUser, 'instantMessages', userId], true)
  }

  $scope.addMessage = function() {
    var currentDate = new Date();
    var formattedDate = moment(currentDate).format('h:mm a');
    $scope.myMessages.$add({
      displayName: $scope.currentUser,
      sender: userId,
      text: $scope.message,
      displayDate: formattedDate, 
      createdAt: Firebase.ServerValue.TIMESTAMP
    });
    $scope.theirMessages.$add({
      displayName: $scope.currentUser,
      sender: userId,
      text: $scope.message,
      displayDate: formattedDate,
      createdAt: Firebase.ServerValue.TIMESTAMP
    });

    $scope.message = '';
  };

  $scope.switchTabs = function(event) {
    clickedTabNumber = event.target.dataset.tabNumber;
    if (clickedTabNumber === '1') {
      $scope.tab1 = true;
      $scope.tab2 = false;
    } else {
      $scope.tab1 = false;
      $scope.tab2 = true;
    }
  }

  $scope.rightOrLeft = function(sender) {
    if (sender === userId) {
      return 'right';
    } else {
      return 'left';
    }
  }



})
})();

