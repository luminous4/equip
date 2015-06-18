angular.module('equip')

  .controller('registerCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
    var email = this.email;
    var password = this.password;
    var ref = new Firebase(refUrl);
    var authObj = $firebaseAuth(ref);

    this.register = function() {
      console.log('just clicked register button');
      // User.register(email, password, authObj);
    };
  })