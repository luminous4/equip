(function() {

angular.module('equip')

.controller('IMCtrl', function($scope, $rootScope, $firebaseArray, User, FirebaseFactory) {

  $scope.message = 'Hey everyone, I\m cool!';
  var userId = User.getCurrentUser().uid;
  var userData = FirebaseFactory.getObject(['users', userId], true);
  var interimFriends = [];
  $scope.allFriendsIds = [];
  $scope.allFriends = [];

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


  // $scope.addMessage = function() {
  //   if (!$rootScope.selectedTeam) {
  //     this.canSend = false;
  //   } else {
  //     this.canSend = true;
  //     $scope.messages.$add({
  //       chatName: $scope.user,
  //       userImg: $scope.img,
  //       text: $scope.message,
  //       createdAt: Firebase.ServerValue.TIMESTAMP
  //     });      
  //   }

  //   this.message = '';
  // };

})
})();

