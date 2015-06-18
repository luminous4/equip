angular.module('equip')

  .factory('User', function($location) {

    var login = function(email, password, firebaseLoginObj) {
      var username = email;

      console.log('inside login func in factory');

      firebaseLoginObj.$authWithPassword('password', {
            email: username,
            password: password
        })
        .then(function(user) {
            // Success callback
            console.log('Authentication successful');
            $location.path('/index')
        }, function(error) {
            // Failure callback
            console.log('Authentication failure in login');
        });

    };

    var register = function(email, password, firebaseAuthObj) {

      console.log('inside register func in factory');

      firebaseAuthObj.$createUser(email, password)
        .then(function(userData) {
            // Success callback
            console.log("User created with uid: " + userData.uid);
            $location.path('/login');
        })
        .catch(function(error) {
          console.log("error:", + error);
      });
    };

    return {
      login: login,
      register: register
    };
  })