angular.module('equip')

.controller('SettingsCtrl', function($scope, FirebaseFactory) {
  
  var userId = FirebaseFactory.getCurrentUser().uid;

  (this.getUserInfo = function() {
    var userInfo = FirebaseFactory.getObject(['users', userId], true);
    console.log('got user info!', userInfo);
    $scope.showDisplayName = userInfo.displayName;
    console.log("display name: ", $scope.showDisplayName);
    $scope.showPhoneNumber = userInfo.phoneNumber;
    $scope.showFacebook = userInfo.Facebook;
    $scope.showGithub = userInfo.Github;
    $scope.showLinkedIn = userInfo.LinkedIn;
    $scope.showOther = userInfo.Other;
  })();

  this.saveUserInfo = function() {
    if (this.displayName) {
      FirebaseFactory.updateItem(['users', userId], {displayName: this.displayName}, true);
    }
    if (this.phoneNumber) {
      FirebaseFactory.updateItem(['users', userId], {phoneNumber: this.phoneNumber}, true);
    }
    if (this.socialInput) {
      newSocial = {};
      newSocial[this.socialSelect] = this.socialInput;
      FirebaseFactory.updateItem(['users', userId], newSocial, true)
    }
    if (this.imgUrl) {
      FirebaseFactory.updateItem(['users', userId], {imgUrl: this.imgUrl}, true);
    }

    this.displayName = '';
    this.socialInput = '';
    this.socialSelect = null;
    this.phoneNumber = '';
    this.imgUrl = '';
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
