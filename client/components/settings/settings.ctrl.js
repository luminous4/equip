angular.module('equip')

.controller('SettingsCtrl', function($scope, FirebaseFactory) {
  $scope.socialSelect = 'first';

  var userId = FirebaseFactory.getCurrentUser().uid;

  this.getUserInfo = function() {
    var userInfo = FirebaseFactory.getObject(['users', userId], true);

    userInfo.$loaded(function() {
      $scope.showDisplayName = userInfo.displayName;
      $scope.showPhoneNumber = userInfo.phoneNumber;
      $scope.showFacebook = userInfo.Facebook;
      $scope.showGitHub = userInfo.GitHub;
      $scope.showLinkedIn = userInfo.LinkedIn;
      $scope.showTwitter = userInfo.Twitter;
      $scope.showOther = userInfo.Other;      
    })
  };

  this.getUserInfo();

  this.saveUserInfo = function() {
    console.log("called saveUserInfo");
    if ($scope.displayName) {
      FirebaseFactory.updateItem(['users', userId], {displayName: $scope.displayName}, true);

    }
    if ($scope.phoneNumber) {
      FirebaseFactory.updateItem(['users', userId], {phoneNumber: $scope.phoneNumber}, true);
    }
    if ($scope.socialInput) {
      newSocial = {};
      newSocial[$scope.socialSelect] = $scope.socialInput;
      FirebaseFactory.updateItem(['users', userId], newSocial, true)
    }
    if ($scope.imgUrl) {
      FirebaseFactory.updateItem(['users', userId], {imgUrl: $scope.imgUrl}, true);
    }

    this.getUserInfo();
    $scope.displayName = '';
    $scope.socialInput = '';
    $scope.socialSelect = 'first';
    $scope.phoneNumber = '';
    $scope.imgUrl = '';
  };

});


// Old team join: 

// if (this.teamName) {
//   checkIfTeamExists(this.teamName, function(teamName, exists) {
//     if(!exists) {
//       FirebaseFactory.updateItem(['teams', teamName], {users: null}, true);
//     }
//     FirebaseFactory.addToCollection(['teams', teamName, 'users'], userId, true);
//   });

//   FirebaseFactory.addToCollection(['users', userId, 'teams'], this.teamName, true);
// }
