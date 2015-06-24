angular.module('equip')

  .controller('RegisterCtrl', function($scope, $firebaseAuth, $location, FirebaseFactory, User, refUrl) {
    var ref = new Firebase(refUrl);
    var authObj = $firebaseAuth(ref);

    var validateEmail = function(email) {


      // console.log('isValid in func validEmail after check', isValid);
      // return isValid;
    };

    this.register = function() {
      console.log('just clicked register button');

      var allUsers = FirebaseFactory.getCollection('users', true);
      console.log('allUsers', allUsers);
      var isValid = true;

      allUsers.$loaded()
        .then(function() {
          angular.forEach(allUsers, function(user) {
            if (user.name === this.email) {
              isValid = false;
            }
          })
        });


      console.log('isValid', isValid);
      User.register(this.email, this.password, authObj);
    };

  })