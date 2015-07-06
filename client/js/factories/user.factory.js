(function() {
   angular.module('equip')

  .factory('User', function($location, $state, $window, $firebaseObject, refUrl, FirebaseFactory) {
    var ref = new Firebase(refUrl);

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
      var allTeams = FirebaseFactory.getCollection('teams', true);
      var foundTeam = false;
      var targetTeam = {};
      var targetTeamId = '';
      var targetTeamUsers = [];

      var newUserId = '';
      var newUserDetails = {};

      allTeams.$loaded()
        .then(function() {
          for (var i = 0; i < allTeams.length; i++) {
            if (allTeams[i].$id === teamName) {
              targetTeam = allTeams[i];
              targetTeamId = targetTeam.$id;
              targetTeamUsers = targetTeam.users;
              foundTeam = true;
            }
          }

          if (foundTeam && (teamAction === 'join')) {
            console.log('join a team');

            // build and save new user
            // false => does not add new team
            createNewUser(email, password, targetTeamId, targetTeamUsers, false, firebaseAuthObj, callback);
          }

          //TODO: display info to user
          if (!foundTeam && (teamAction === 'join')) {
            callback(true, true, false)
            // console.log('Team to join not found');
          }

          if (!foundTeam && (teamAction === 'create')) {
            console.log('create new team');

            targetTeamId = teamName;

            // build and save new user
            // true => adds new team
            createNewUser(email, password, targetTeamId, targetTeamUsers, true, firebaseAuthObj, callback);
          }

          //TODO: display info to user
          if (foundTeam && (teamAction === 'create')) {
            callback(true, false, true);
            // console.log('Team to create already exists');
          }
        });
      };

    var createNewUser = function(email, password, targetTeamId, targetTeamUsers, addsTargetTeam, firebaseAuthObj, callback) {
      firebaseAuthObj.$createUser({
        email: email,
        password: password
      })
      .then(function(userData) {
        $window.localStorage.setItem('equipAuth', userData.token);

        newUserId = userData.uid;

        var teamToJoin = {};
        teamToJoin[targetTeamId] = targetTeamId;

        var newUserDetails = {
          email: email,
          displayName: email.replace(/@.*/, ''),
          imgUrl: 'http://www.gravatar.com/avatar/' + hashEmail(email) + '.jpg',
          teams: teamToJoin
        };

        // save new user to db
        ref.child('users').child(newUserId).set(newUserDetails);

        // add new user to targetTeam's user list
        var tempUsers = [];
        for (var i = 0; i < targetTeamUsers.length; i++) {
          tempUsers.push(targetTeamUsers[i]);
        }
        tempUsers.push(newUserId);

        // creates new team
        if (addsTargetTeam) {
          var now = moment().format('MMMM Do YYYY, h:mm a');
          FirebaseFactory.updateItem(['teams', targetTeamId], {users: tempUsers, createdAt: now}, true);
        } else {
          FirebaseFactory.updateItem(['teams',targetTeamId], {users: tempUsers}, true);
        }

        $location.path('/login');
        callback(true, false, false);
      })
      // error saving user
      .catch(function(error) {
        console.log('error:', + error);
        callback(false, false, false);
      });
    };

    var getCurrentUser = function() {
      var userObj = $window.localStorage.getItem('firebase:session::mksequip');
      if(!userObj) $state.go('login');
      var user = JSON.parse(userObj);
      return user;
    };

    var getUserInfo = function(userId) {
      return $firebaseObject(ref.child('users').child(userId));
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
      getCurrentUser: getCurrentUser,
      getUserInfo: getUserInfo,
      isAuth: isAuth
    };
  });
})();
