(function() {
   angular.module('equip')

  .factory('User', function($location, $state, $window, refUrl, FirebaseFactory) {
    var login = function(email, password, firebaseLoginObj, callback) {
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

    var register = function(email, password, teamName, teamAction, firebaseAuthObj, callback) {
      // console.log('teamName in user factory', teamName);
      // console.log('teamAction', teamAction);

      firebaseAuthObj.$createUser({
        email: email,
        password: password
      })
      .then(function(userData) {
        $window.localStorage.setItem('equipAuth', userData.token);

        var ref = new Firebase(refUrl);
        ref.child('users').child(userData.uid).set({
          email: email,
          displayName: email.replace(/@.*/, ''),
          imgUrl: 'http://www.gravatar.com/avatar/' + hashEmail(email) + '.jpg'
        });

        // // if teamAction === join
        // if (teamAction === 'join') {
        //   console.log('in join');
        //   // get target team by name teamName
        //   // get current user
        //   // add current user to target team
        //   // add target team to current user 'team list'
        // } else {
        //   // add new team with teamName to collection teams
        //   // get current user
        //   // add current user to new team
        //   // add new team to current user 'team list'
        // }

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
  });
})();
