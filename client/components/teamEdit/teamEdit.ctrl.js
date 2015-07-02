(function() {
  angular.module('equip')

  .controller('TeamController', function($scope, $state, $stateParams, $firebaseArray, $timeout, $rootScope, $firebaseObject, User, FirebaseFactory, refUrl) {

    var currentUser;
    $scope.currentTab = "Team List";

    // Tracks the original $id of a team to update it when editing
    $scope.editingTeamPreviousId = null;

    // Search string used in 'teamSearch' filter (at the bottom of $scope file)
    $scope.searchString = "";
    $scope.loading = true;
    $scope.triedToLeave = false;

    $scope.initialize = function() {
      currentUser = User.getCurrentUser();
      $scope.teams = FirebaseFactory.getCollection('teams', true);
      $scope.allUsers = FirebaseFactory.getCollection('users', true);

      /**
       *  Once the team information is loaded, $scope will pare $scope.teams and
       *  $scope.allUsers to the actual information the user is supposed to see.
       *  NOTE: this is not scalable!!! It wouldn't be too hard to change it though
       */

      $scope.teams.$loaded().then(function() {

        $scope.loading = false;

        // Will track which users are connected to the logged in user
        $scope.connectedUserIds = [];

        for (var i = $scope.teams.length-1; i >= 0; i--) {

          // this case will prevent teams without any users from showing
          if (!$scope.teams[i] || !$scope.teams[i].users) {
            $scope.teams.splice(i, 1);
            continue;
          }

          // if user isn't on team i
          if ($scope.teams[i].users.indexOf(currentUser.uid) === -1) {
            $scope.teams.splice(i, 1);
          } else {
            // Adds all the other users on this team to a list of connected users
            for (var j = 0; j < $scope.teams[i].users.length; j++) {
              $scope.connectedUserIds.push($scope.teams[i].users[j]);
            }
          }
        }
      });
    };

    $scope.initialize();

      //////////////////////////
     // Navigation functions //
    //////////////////////////


    $scope.setTab = function(newTab, team) {

      // Set the current tab
      $scope.currentTab = newTab;

      // Reset these variables
      $scope.editingTeamUserlist = [];
      $scope.editingTeamListOfRemovedPeople = [];
      $scope.editingTeamListOfAddedPeople = [];
      $scope.triedToLeave = false;
      var allKeys = [];

      if (newTab === 'Team List') {
        $scope.initialize();
      } else if (newTab === 'Create A Team') {
        // Create A Team tab

        // Set the team being edited to an empty team
        $scope.editingTeam = {
          $id: "Team Title",
          users: [],
          calendarEvents: []
        };

        var currentUserFirebaseObject = FirebaseFactory.getObject(
          ['users', currentUser.uid],
          true
        );
        currentUserFirebaseObject.$loaded().then(function() {
          $scope.flipPresence(currentUserFirebaseObject);
        });

      } else if (newTab === 'Edit Team') {
        // Edit Team tab

        // Set the team being edited to the clicked team
        $scope.editingTeam = team;

        // Remember the old ID of the team so we can update it later
        $scope.editingTeamPreviousId = $scope.editingTeam.$id;

        // Get the user information of everyone on the team
        var keys = Object.keys(team.users);
      }

      //???
      if(!keys) {
        var keys = [];
      }

      for (var i = 0; i < $scope.allUsers.length; i++) {
        allKeys.push($scope.allUsers[i].$id);
      }
      for (var i = 0; i < keys.length; i++) {
        $scope.editingTeamUserlist.push(
          FirebaseFactory.getObject(
            [ 'users', team.users[keys[i]] ],
            true
        ));
      }

      // Get the information of all connected users
      // Note: this is not scalable! We should fix later
      if (newTab === 'Create A Team' || newTab === 'Edit Team') {
        $scope.allUsers = [];
        for (var i = 0; i < allKeys.length; i++) {

          // If $scope user is not connected, just move along
          if ($scope.connectedUserIds.indexOf(allKeys[i]) === -1) {
            continue;
          }

          // Otherwise, add $scope user's firebase object to the list of
          // connected users
          $scope.allUsers.push(
            FirebaseFactory.getObject(
              [ 'users', allKeys[i]],
              true)
          );
        }
      }
    }


      ////////////////////////////
     // List editing functions //
    ////////////////////////////


    $scope.leaveTeam = function(team) {

      if(!$scope.checkTeamsLeft()) {
        return;
      }

      $scope.checkTeamContext(team);

      // Removes $scope team from the user's team list
      FirebaseFactory.removeItem(
        ['users', currentUser.uid,
          'teams', team.$id],
        true
      );
      for (var i = 0; i < $scope.teams.length; i++) {
        if ($scope.teams[i].$id === team.$id) {
          $scope.teams.splice(i, 1);
          break;
        }
      }

      // Finds the users of the clicked on team and removes
      // the currently logged in user
      var teamUsers = FirebaseFactory.getCollection(
        ['teams', team.$id, 'users'],
        true
      );
      teamUsers.$loaded().then(function() {
        var index = -1;
        for (var i = 0; i < teamUsers.length; i++) {
          if (teamUsers[i].$value === currentUser.uid) {
            index = i;
          }
        }
        FirebaseFactory.removeItem(
          ['teams', team.$id, 'users', index],
          true
        );
      });
    }


    // Either adds or removes the clicked user to the
    // working list of users on $scope team
    $scope.flipPresence = function(user) {

      // Find out if $scope user is on the list
      var $scopeUserIndex = -1;
      for (var i = 0; i < $scope.editingTeamUserlist.length; i++) {
        if (user.$id === $scope.editingTeamUserlist[i].$id) {
          $scopeUserIndex = i;
        }
      }

      if ($scopeUserIndex !== -1) {
        // The clicked user is on the list of users on the team

        // Remember $scope $scope user was removed from the team
        $scope.editingTeamListOfRemovedPeople.push(user);
        var addedIndex = $scope.editingTeamListOfAddedPeople.indexOf(user);
        if (addedIndex > -1) {
          $scope.editingTeamListOfRemovedPeople.splice(addedIndex, 1);
        }

        // Remove $scope user from the list
        $scope.editingTeamUserlist.splice($scopeUserIndex, 1);

      } else {
        // The clicked user is not on the list of users on the team yet

        // Remember $scope $scope user was added to the team
        $scope.editingTeamListOfAddedPeople.push(user)
        var removedIndex = $scope.editingTeamListOfRemovedPeople.indexOf(user);
        if (removedIndex > -1) {
          $scope.editingTeamListOfRemovedPeople.splice(removedIndex, 1);
        }

        // Add $scope user to the list
        $scope.editingTeamUserlist.push(user);
      }
    }


    // Creates a new team in firebase
    $scope.createTeamSubmit = function() {

      // Make a list of users in a format approprite for firebase team object
      var usersList = [];
      for (var i = 0; i < $scope.editingTeamUserlist.length; i++) {
        usersList.push($scope.editingTeamUserlist[i].$id);
      }

      // Get createdAt date
      var now = moment().format('MMMM Do YYYY, h:mm a');

      // Add $scope team to firebase
      FirebaseFactory.updateItem(
        ['teams', $scope.editingTeam.$id],
        {users: usersList, createdAt: now},
        true
      );

      // Add the team to each user's team list
      for (var i = 0; i < usersList.length; i++) {
        var firebaseKeyIsValueObject = {};
        firebaseKeyIsValueObject[$scope.editingTeam.$id] = $scope.editingTeam.$id;
        FirebaseFactory.updateItem(
          ['users', usersList[i], 'teams'],
          firebaseKeyIsValueObject,
          true
        );
      }

      // Return to the team selection menu
      $scope.setTab('Team List');
    }


    // Deletes $scope team from firebase
    $scope.editTeamDelete = function() {

      if(!$scope.checkTeamsLeft()) {
        return;
      }

      // Remove $scope team from firebase
      FirebaseFactory.removeItem(['teams', $scope.editingTeamPreviousId], true);

      // Remove $scope team from all its users
      for (var i = 0; i < $scope.editingTeamUserlist.length; i++ ){
        FirebaseFactory.removeItem(
          ['users', $scope.editingTeamUserlist[i].$id,
            'teams', $scope.editingTeamPreviousId],
          true
        );
      }

      // Return to the team selection menu
      $scope.setTab('Team List');
    }


    // Updates $scope team in the firebase
    $scope.editTeamSubmit = function(toDelete) {

      // Make a list of users in a format approprite for firebase team object
      var usersList = [];
      for (var i = 0; i < $scope.editingTeamUserlist.length; i++) {
        usersList.push($scope.editingTeamUserlist[i].$id);
      }

      // Updates the team in firebase
      FirebaseFactory.updateItem(
        ['teams', $scope.editingTeamPreviousId],
        {users: usersList},
      true);

      // Removes $scope team from each user who has been been removed
      for (var i = 0; i < $scope.editingTeamListOfRemovedPeople.length; i++) {
        FirebaseFactory.removeItem(
          ['users', $scope.editingTeamListOfRemovedPeople[i].$id,
            'teams', $scope.editingTeam.$id],
          true
        );
      }

      // Adds $scope team to each user
      for (var i = 0; i < $scope.editingTeamListOfAddedPeople.length; i++) {
        var firebaseKeyIsValueObject = {};
        firebaseKeyIsValueObject[$scope.editingTeam.$id] =
          $scope.editingTeam.$id;
        FirebaseFactory.updateItem(
          ['users', $scope.editingTeamListOfAddedPeople[i].$id, 'teams'],
          firebaseKeyIsValueObject,
          true
        );
      }

      // Return to the team selection menu
      $scope.setTab('Team List');
    }


      //////////////////
     // UI functions //
    //////////////////


    // Gets the user's picture from firebase
    $scope.getUserPicture = function(userId) {
      if (userId === null || userId === undefined) {
        return "img/user.png";
      }
      if (userId.imgUrl !== undefined) {
        return userId.imgUrl;
      }

      for (var i = 0; i < $scope.allUsers.length; i++) {
        if ($scope.allUsers[i].$id === userId) {
          if ($scope.allUsers[i].imgUrl) {
            return $scope.allUsers[i].imgUrl;
          } else {
            return 'img/user.png';
          }
        }
      }
    },


    // Gets the user's display name from firebase
    $scope.getUsername = function(userId) {
      if (userId === null || userId === undefined) return "Unknown user";

      for (var i = 0; i < $scope.allUsers.length; i++) {
        if ($scope.allUsers[i].$id === userId) {
          return $scope.allUsers[i].displayName;
        }
      }
    }


    // Hides the flipPresence label for the logged in user.
    // $scope makes it so you can't remove yourself from a team
    // in the edit menu.
    $scope.hideOwnUser = function(user) {
      return (user.$id === currentUser.uid);
    }


      ///////////////////////
     // Utility functions //
    ///////////////////////


    // Make sure the user isn't deleting their last team
    $scope.checkTeamsLeft = function() {
      if($scope.teams.length < 2 && !$scope.triedToLeave) {
        var removeErrorMessage = function() {
          $scope.triedToLeave = false;
        }
        $scope.triedToLeave = true;
        $timeout(removeErrorMessage, 4000);
        return false;
      }

      return !$scope.triedToLeave;
    }


    $scope.checkTeamContext = function(checkingTeam) {
      for(var i = 0; i < checkingTeam.users.length; i++) {
        if(checkingTeam.users[i] === currentUser.uid) {
          localStorage.selectedTeam = "null";
          $rootScope.selectedTeam = null;
        }
      }
    }
  })

  // Filter for searching team names
  .filter('teamSearch', function(){
    return function(arr, searchString){
      if (!searchString){
        return arr;
      }
      var result = [];
      searchString = searchString.toLowerCase();
      // Using the forEach helper method to loop through the array
      angular.forEach(arr, function(item){
        if (item !== null && item !== undefined &&
           item.$id.toLowerCase().indexOf(searchString) !== -1) {
          result.push(item);
        }
      });
      return result;
    }
  });
})();
