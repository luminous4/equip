(function() {
   angular.module('equip')

  .factory('User', function($location, $state, $window, $rootScope, refUrl, FirebaseFactory) {
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
      console.log('teamName in user factory', teamName);
      console.log('teamAction', teamAction);

      var allTeams = FirebaseFactory.getCollection('teams', true);
      var foundTeam = false;
      var targetTeam = {};
      var targetTeamId = '';
      var targetTeamUsers = [];
      var newUserId = '';

      allTeams.$loaded()
        .then(function() {
          console.log('allTeams', allTeams);
          for (var i = 0; i < allTeams.length; i++) {
            if (allTeams[i].$id === teamName) {
              targetTeam = allTeams[i];
              targetTeamId = targetTeam.$id;
              targetTeamUsers = targetTeam.users;
              foundTeam = true;
            }
          }

          if (foundTeam && (teamAction === 'join')) {
            console.log('targetTeam found:', targetTeam);
            console.log('join a team');

            // create new user
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
              }

              // save new user to db
              ref.child('users').child(newUserId).set(newUserDetails);
              // FirebaseFactory.addToCollection(['users', newUserId], newUserDetails, true);

              // add new user to targetTeam
              var tempUsers = [];
              for (var i = 0; i < targetTeamUsers.length; i++) {
                tempUsers.push(targetTeamUsers[i]);
              }
              tempUsers.push(newUserId);

              FirebaseFactory.updateItem(['teams',targetTeamId], {users: tempUsers}, true);

              $location.path('/login');
              callback(true);
            })
            // error saving user
            .catch(function(error) {
              console.log('error:', + error);
              callback(false);
            });
          }

          //TODO: display info to user
          if (!foundTeam && (teamAction === 'join')) {
            console.log('Team to join not found');
          }

          if (!foundTeam && (teamAction === 'create')) {
            console.log('create new team');

            targetTeamId = teamName;

            // create new user
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
              // FirebaseFactory.addToCollection(['users', newUserId], newUserDetails, true);

              var now = moment().format('MMMM Do YYYY, h:mm a');
              FirebaseFactory.updateItem(['teams', targetTeamId], {users: [newUserId], createdAt: now}, true);

              $location.path('/login');
              callback(true);
            })
            // error saving user
            .catch(function(error) {
              console.log('error:', + error);
              callback(false);
            });
          }

          //TODO: display info to user
          if (foundTeam && (teamAction === 'create')) {
            console.log('Team to create already exists');
          }
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
