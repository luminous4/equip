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
      FirebaseFactory.updateItem(['users', userId], {displayName: this.displayName});
    }

    if (this.teamName) {
      checkIfTeamExists(this.teamName, function(teamName, exists) {
        if(!exists) {
          FirebaseFactory.updateItem(['teams', teamName], {users: null});
        }
        FirebaseFactory.addToCollection(['teams', teamName, 'users'], userId);
      });

      FirebaseFactory.addToCollection(['users', userId, 'teams'], this.teamName);
    }

    if (this.phoneNumber) {
      FirebaseFactory.updateItem(['users', userId], {phoneNumber: this.phoneNumber});
    }
    if (this.imgUrl) {
      FirebaseFactory.updateItem(['users', userId], {imgUrl: this.imgUrl});
    }

    this.displayName = "";
    this.teamName = "";
    this.phoneNumber = "";
    this.imgUrl = "";
  };

});
