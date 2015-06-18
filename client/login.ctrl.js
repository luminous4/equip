angular.module('equip')

  // constant variables are available throughout app
  .constant('refUrl', 'https://mksequip.firebaseIO.com')

  .controller('loginCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
    // To prevent form refresh
    // event.preventDefault();
    var ref = new Firebase(refUrl);
    var loginObj = $firebaseAuth(ref);

    this.login = function() {
      User.login(this.email, this.password, loginObj);
    };
  })