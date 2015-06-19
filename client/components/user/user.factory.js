angular.module('equip')

  .factory('User', function($location, $state) {

    var login = function(email, password, firebaseLoginObj) {
      console.log('inside login func in factory');

      firebaseLoginObj.$authWithPassword({
          email: email,
          password: password
        })
        .then(function(authData) {
          // Success callback
          console.log('Logged in as:', authData.uid, authData);
          $state.go('index.home', {authData: authData});
        })
        .catch(function(error) {
          console.log('Authentication error in login:', + error);
        });
    };

    var register = function(email, password, firebaseAuthObj) {
      console.log('inside register func in factory');
      console.log("email in register func in factory", email);

      firebaseAuthObj.$createUser({
        email: email,
        password: password
      })
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