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
      ref.child('users').child(userId).update({
        displayName: this.displayName
      });
    }

    if (this.teamName) {
      checkIfTeamExists(this.teamName, function(teamName, exists) {
        if(!exists) {
          ref.child('teams').child(teamName).set({teamName: teamName, users: null});
        }

        FirebaseFactory.addToCollection(['teams', teamName, 'users'], userId);

        // var teamUsers = $firebaseArray(ref.child('teams').child(teamName).child('users'));
        // teamUsers.$add();
      })

      var userTeams = $firebaseArray(ref.child('users').child(userId).child('teams'));
      userTeams.$add(this.teamName);
    }

    if (this.phoneNumber) {
      ref.child('users').child(userId).update({
        phoneNumber: this.phoneNumber
      });
    }
    if (this.imgUrl) {
      ref.child('users').child(userId).update({
        imgUrl: this.imgUrl
      });
    }

    this.displayName = "";
    this.teamName = "";
    this.phoneNumber = "";
    this.imgUrl = "";
  };

});
