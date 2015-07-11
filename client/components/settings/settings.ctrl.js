(function() {

angular.module('equip')
.controller('SettingsCtrl', function($scope, $rootScope, User, FirebaseFactory) {
  $rootScope.goToTop();

  var userId = User.getCurrentUser().uid;
  $scope.socialSelect = 'Facebook';
  $scope.success = false;

  $scope.getUserInfo = function() {
    var userInfo = User.getUserInfo(userId);

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

  $scope.getUserInfo();

  $scope.checkSuccess = function() {
    $scope.success = false;
  }

  $scope.saveUserInfo = function() {
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

    $scope.getUserInfo();
    $scope.success = true;
    $scope.displayName = '';
    $scope.socialInput = '';
    $scope.socialSelect = 'Facebook';
    $scope.phoneNumber = '';
    $scope.imgUrl = '';
  };

});
})();
