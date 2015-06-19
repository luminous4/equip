angular.module('equip')

.controller('SettingsCtrl', function($scope, $window, refUrl) {
  
  var userObj = $window.localStorage.getItem('firebase:session::mksequip');
  var userId = JSON.parse(userObj).uid;


  this.saveUserInfo = function() {
    //add to firebase reference with the following info
    var ref = new Firebase(refUrl);
    ref.child("users").child(userId).update({
      displayName: this.displayName,
      phoneNumber: this.phoneNumber,
      imgUrl: this.imgUrl
    });
  };

});
