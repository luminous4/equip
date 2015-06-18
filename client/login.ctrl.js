angular.module('equip')

  // constant variables are available throughout app
  .constant('refUrl', 'https://mksequip.firebaseIO.com')

  .controller('loginCtrl', function($scope, $firebaseAuth, $location, User, refUrl) {
    // To prevent form refresh
    event.preventDefault();
    var ref = new Firebase(refUrl);

    var username = this.email;
    var password = this.password;
    var loginObj = $firebaseAuth(ref);

    this.login = function() {
      User.login(username, password, loginObj);
    };
  })