angular.module('equip')

  .controller('loginCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
    // To prevent form refresh
    // event.preventDefault();
    var ref = new Firebase(refUrl);
    var loginObj = $firebaseAuth(ref);

    this.login = function() {
      console.log('just clicked login button');
      User.login(this.email, this.password, loginObj);
    };
  })