angular.module('equip')

.controller('SettingsCtrl', function($scope, $window, refUrl) {
  
  var userObj = $window.localStorage.getItem('firebase:session::mksequip');
  var userId = JSON.parse(userObj).uid;


  this.saveUserInfo = function() {
    //add to firebase reference with the following info
    var ref = new Firebase(refUrl);
    if (this.displayName) {
      ref.child("users").child(userId).update({
        displayName: this.displayName,
      });
    }
    if (this.phoneNumber) {
      ref.child("users").child(userId).update({
        phoneNumber: this.phoneNumber,
      });
    }
    if (this.imgUrl) {
      ref.child("users").child(userId).update({
        imgUrl: this.imgUrl,
      });
    }

    this.displayName = "";
    this.phoneNumber = "";
    this.imgUrl = "";
  };

});
