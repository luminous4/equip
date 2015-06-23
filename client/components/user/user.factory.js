angular.module('equip')

  .factory('User', function($location, $state, $window, refUrl) {

    var login = function(email, password, firebaseLoginObj) {
      console.log('inside login func in factory');

      firebaseLoginObj.$authWithPassword({
          email: email,
          password: password
        })
        .then(function(authData) {
          // Success callback
          console.log('token in login func in user factory:', authData.token);
          $window.localStorage.setItem('equipAuth', authData.token);
          $state.go('index.home');
        })
        .catch(function(error) {
          console.log('Authentication error in login:', + error);
        });
    };

    var register = function(email, password, firebaseAuthObj) {
      console.log('inside register func in factory');
      console.log('email in register func in factory', email);

      firebaseAuthObj.$createUser({
        email: email,
        password: password
      })
      .then(function(userData) {
        // Success callback
        console.log('User created with uid: ' + userData.uid);
        $window.localStorage.setItem('equipAuth', userData.token);

        var ref = new Firebase(refUrl);
        ref.child('users').child(userData.uid).set({
          name: email,
          displayName: email.replace(/@.*/, ''),
          imgUrl: 'http://bioweb.uwlax.edu/bio203/s2009/aschenbr_rach/cat%20eyes%20and%20ears.jpg'
        });

        $location.path('/login');
      })
      .catch(function(error) {
        console.log('error:', + error);
      });
    };

    var isAuth = function() {
      return !!$window.localStorage.getItem('equipAuth');
    };

    return {
      login: login,
      register: register,
      isAuth: isAuth
    };
  })
