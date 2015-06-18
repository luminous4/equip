angular.module('equip.settings', [])

.controller('SettingsCtrl', function($scope) {

  this.saveUserInfo = function() {
    //create firebase reference with the following info
    console.log(this.displayName);
    console.log(this.phoneNumber);
    console.log(this.imgUrl);
  };

});
