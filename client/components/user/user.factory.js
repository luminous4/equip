angular.module('equip')

  .factory('User', function($location, $state, $window, refUrl) {
    var login = function(email, password, firebaseLoginObj, callback) {
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
          callback(true);
        })
        .catch(function(error) {
          console.log('Authentication error in login:', + error);
          callback(false);
        });
    };

    var register = function(email, password, firebaseAuthObj, callback) {
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
          email: email,
          displayName: email.replace(/@.*/, ''),
          imgUrl: 'http://www.gravatar.com/avatar/' + hashEmail(email) + '.jpg'
        });

        $location.path('/login');
        callback(true);
      })
      .catch(function(error) {
        console.log('error:', + error);
        callback(false);
      });
    };

    var isAuth = function() {
      return !!$window.localStorage.getItem('equipAuth');
    };

    var hashEmail = function(email) {
      return md5(email.trim());
    }

    return {
      login: login,
      register: register,
      isAuth: isAuth
    };
  })
