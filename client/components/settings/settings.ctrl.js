angular.module('equip')

.controller('SettingsCtrl', function($scope, $window, $firebaseArray, FirebaseFactory, refUrl) {
  
  var userObj = $window.localStorage.getItem('firebase:session::mksequip');
  var userId = JSON.parse(userObj).uid;
  var ref = new Firebase(refUrl);

  var checkIfTeamExists = function(teamName, cb) {
    ref.child('teams').child(teamName).once('value', function(snapshot) {
      var exists = (snapshot.val() !== null);
      cb(teamName, exists);
    });
  }

  this.saveUserInfo = function() {
    if (this.displayName) {
      FirebaseFactory.updateItem(['users', userId], {displayName: this.displayName}, true);
    }

    if (this.teamName) {
      checkIfTeamExists(this.teamName, function(teamName, exists) {
        if(!exists) {
          FirebaseFactory.updateItem(['teams', teamName], {users: null}, true);
        }
        FirebaseFactory.addToCollection(['teams', teamName, 'users'], userId, true);
      });

      FirebaseFactory.addToCollection(['users', userId, 'teams'], this.teamName, true);
    }

    if (this.phoneNumber) {
      FirebaseFactory.updateItem(['users', userId], {phoneNumber: this.phoneNumber}, true);
    }
    if (this.imgUrl) {
      FirebaseFactory.updateItem(['users', userId], {imgUrl: this.imgUrl}, true);
    }

    this.displayName = '';
    this.teamName = '';
    this.phoneNumber = '';
    this.imgUrl = '';
  };

});
