angular.module('equip')

  .controller('RegisterCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
    var ref = new Firebase(refUrl);
    var authObj = $firebaseAuth(ref);

    this.register = function() {
      console.log('just clicked register button');
      User.register(this.email, this.password, authObj);
    };
  })