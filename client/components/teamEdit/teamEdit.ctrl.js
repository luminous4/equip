// to do later:
// when you click submit, change all the users 
// when you delete a team, remove that team from all the users' team lists

(function() {
  angular.module('equip')

  .controller('TeamController', function($scope, $state, $stateParams, FirebaseFactory,
                                            $firebaseArray, refUrl, $firebaseObject) {


      ///////////////////////////
     // Initialized variables //
    ///////////////////////////

    // These three 'tabs' are basically routes 
    this.tabs = [
      "Team List",
      "Create A Team",
      "Edit Team"
    ];

    // Defaults view to the Team List tab
    this.currentTab = "Team List";

    // Tracks the original $id of a team to update it when editing
    this.oldId = null;

    // Search string used in 'teamSearch' filter (at the bottom of this file)
    this.searchString = "";

    this.connectedUsers = [];

    // These parts of initialization must be recalculated when you return to
    // the team list tab
    // This function is immediately invoked
    this.initialize = function() {

      // List of all teams the user is on
      this.teams = FirebaseFactory.getCollection('teams', true);

      // List of all users that the user is connected to (through their teams)
      this.allUsers = FirebaseFactory.getCollection('users', true);

      // Once the team information is loaded, this will pare this.teams and 
      // this.allUsers to the actual information the user is supposed to see.
      // NOTE: This is not scalable!!! It wouldn't be too hard to change it though
      var that = this;
      var currentUser = FirebaseFactory.getCurrentUser();
      this.teams.$loaded().then(function() {


        // Will track which users are connected to the logged in user
        that.connectedUsers = [];

        for(var i = that.teams.length-1; i >= 0; i--) {

          // This case will prevent teams without any users from showing
          if(!that.teams[i] || !that.teams[i].users) {
            that.teams.splice(i, 1);
            continue;
          };

          if(that.teams[i].users.indexOf(currentUser.uid) === -1) {
            // => This user isn't on team i

            // Removes the team without this user from our display list
            that.teams.splice(i, 1);
          } else {
            // => This user is on team i

            // Adds all the other users on this team to a list of connected users
            for(var j = 0; j < that.teams[i].users.length; j++) {
              that.connectedUsers.push(that.teams[i].users[j]);
            }
          }

        }

      });
    };

    this.initialize();


      //////////////////////////
     // Navigation functions //
    //////////////////////////


    this.setTab = function(tabNumber, team) {
      
      // Set the current tab 
      this.currentTab = this.tabs[tabNumber];

      // Reset these variables
      this.editingTeamUserlist = [];
      this.editingTeamListOfRemovedPeople = [];
      this.editingTeamListOfAddedPeople = [];

      if (tabNumber === 0) {
        this.initialize();
      } else if(tabNumber === 1) { 
        // Create A Team tab

        // Set the team being edited to an empty team
        this.editingTeam = {
          $id: "Team Title",
          users: [],
          calendarEvents: []
        };

        var currentUser = FirebaseFactory.getCurrentUser();
        var currentUserFirebaseObject = FirebaseFactory.getObject(
          ['users', currentUser.uid],
          true
        );
        var that = this;
        currentUserFirebaseObject.$loaded().then(function() {
          that.flipPresence(currentUserFirebaseObject);
        });



      } else if (tabNumber === 2) { 
        // Edit Team tab

        // Set the team being edited to the clicked team
        this.editingTeam = team;

        // Remember the old ID of the team so we can update it later
        this.oldId = this.editingTeam.$id;

        // Get the user information of everyone on the team
        var keys = Object.keys(team.users);
        var allKeys = [];
        for(var i = 0; i < this.allUsers.length; i++) {
          allKeys.push(this.allUsers[i].$id);
        }
        for(var i = 0; i < keys.length; i++) {
          this.editingTeamUserlist.push(
            FirebaseFactory.getObject(
              [ 'users', team.users[keys[i]] ], 
              true
          ));
        }

        // Get the information of all connected users 
        // Note: this is not scalable! We should fix later
        this.allUsers = [];      
        for(var i = 0; i < allKeys.length; i++) {

          // If this user is not connected, just move along
          if(this.connectedUsers.indexOf(allKeys[i]) === -1) {
            continue;
          }

          // Otherwise, add this user's firebase object to the list of
          // connected users
          this.allUsers.push(
            FirebaseFactory.getObject(
              [ 'users', allKeys[i]], 
              true)
          );
        }
      }

      // Get the information of all connected users 
      // Note: this is not scalable! We should fix later
      if(tabNumber === 1 || tabNumber === 2) {
        this.allUsers = [];      
        for(var i = 0; i < allKeys.length; i++) {

          // If this user is not connected, just move along
          if(this.connectedUsers.indexOf(allKeys[i]) === -1) {
            continue;
          }

          // Otherwise, add this user's firebase object to the list of
          // connected users
          this.allUsers.push(
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


    this.leaveTeam = function(team) {
      var that = this;

      // Removes this team from the user's team list
      var currentUser = FirebaseFactory.getCurrentUser();
      FirebaseFactory.removeItem(
        ['users', currentUser.uid, 
          'teams', team.$id], 
        true
      );
      for(var i = 0; i < that.teams.length; i++) {
        if(that.teams[i].$id === team.$id) {
          that.teams.splice(i, 1);
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
        for(var i = 0; i < teamUsers.length; i++) {
          if(teamUsers[i].$value === currentUser.uid) {
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
    // working list of users on this team
    this.flipPresence = function(user) {

      // Find out if this user is on the list 
      var thisUserIndex = -1;
      for(var i = 0; i < this.editingTeamUserlist.length; i++) {
        if(user.$id === this.editingTeamUserlist[i].$id) {
          thisUserIndex = i;
        }
      }

      if(thisUserIndex !== -1) {
        // The clicked user is on the list of users on the team 

        // Remember that this user was removed from the team
        this.editingTeamListOfRemovedPeople.push(user);
        var addedIndex = this.editingTeamListOfAddedPeople.indexOf(user);
        if(addedIndex > -1) {
          this.editingTeamListOfRemovedPeople.splice(addedIndex, 1);
        }

        // Remove this user from the list
        this.editingTeamUserlist.splice(thisUserIndex, 1);

      } else {
        // The clicked user is not on the list of users on the team yet

        // Remember that this user was added to the team
        this.editingTeamListOfAddedPeople.push(user)
        var removedIndex = this.editingTeamListOfRemovedPeople.indexOf(user);
        if(removedIndex > -1) {
          this.editingTeamListOfRemovedPeople.splice(removedIndex, 1);
        }
        
        // Add this user to the list
        this.editingTeamUserlist.push(user);
      }
    }


    // Creates a new team in firebase
    this.createTeamSubmit = function() {

      // Make a list of users in a format approprite for firebase team object
      var usersList = [];
      for(var i = 0; i < this.editingTeamUserlist.length; i++) {
        usersList.push(this.editingTeamUserlist[i].$id);
      }

      // Get createdAt date
      var now = moment().format('MMMM Do YYYY, h:mm a');

      // Add this team to firebase
      FirebaseFactory.updateItem(
        ['teams', this.editingTeam.$id], 
        {users: usersList, createdAt: now}, 
        true
      );

      // Add the team to each user's team list 
      for(var i = 0; i < usersList.length; i++) {
        var firebaseKeyIsValueObject = {};
        firebaseKeyIsValueObject[this.editingTeam.$id] = this.editingTeam.$id;
        FirebaseFactory.updateItem(
          ['users', usersList[i], 'teams'], 
          firebaseKeyIsValueObject, 
          true
        );
      }

      // Return to the team selection menu
      this.setTab(0);
    }


    // Deletes this team from firebase
    this.editTeamDelete = function() {

      // Remove this team from firebase
      FirebaseFactory.removeItem(['teams', this.oldId], true);

      // Remove this team from all its users
      for(var i = 0; i < this.editingTeamUserlist.length; i++ ){
        FirebaseFactory.removeItem(
          ['users', this.editingTeamUserlist[i].$id, 
            'teams', this.oldId], 
          true
        );
      }

      // Return to the team selection menu
      this.setTab(0);
    }


    // Updates this team in the firebase
    this.editTeamSubmit = function(toDelete) {

      // Make a list of users in a format approprite for firebase team object
      var usersList = [];
      for(var i = 0; i < this.editingTeamUserlist.length; i++) {
        usersList.push(this.editingTeamUserlist[i].$id);
      }

      // Updates the team in firebase
      FirebaseFactory.updateItem(
        ['teams', this.oldId], 
        {users: usersList}, 
      true);

      // Removes this team from each user who has been been removed 
      for(var i = 0; i < this.editingTeamListOfRemovedPeople.length; i++) {
        FirebaseFactory.removeItem(
          ['users', this.editingTeamListOfRemovedPeople[i].$id, 
            'teams', this.editingTeam.$id], 
          true
        );
      }

      // Adds this team to each user
      for(var i = 0; i < this.editingTeamListOfAddedPeople.length; i++) {
        var firebaseKeyIsValueObject = {};
        firebaseKeyIsValueObject[this.editingTeam.$id] = 
          this.editingTeam.$id;
        FirebaseFactory.updateItem(
          ['users', this.editingTeamListOfAddedPeople[i].$id, 'teams'], 
          firebaseKeyIsValueObject, 
          true
        );
      }

      // Return to the team selection menu
      this.setTab(0);
    }


      //////////////////
     // UI functions //
    //////////////////


    // Gets the user's picture from firebase
    this.getUserPicture = function(userId) {
      if(userId === null || userId === undefined) return "img/user.png";
        if(userId.imgUrl !== undefined) return userId.imgUrl;

      for(var i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].$id === userId) {
          if(this.allUsers[i].imgUrl) {
            return this.allUsers[i].imgUrl;
          } else {
            return 'img/user.png';
          }
        }
      }
    },


    // Gets the user's display name from firebase
    this.getUsername = function(userId) {
      if(userId === null || userId === undefined) return "Unknown user";

      for(var i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].$id === userId) {
          return this.allUsers[i].displayName;
        }
      }
    }

    // Hides the flipPresence label for the logged in user.
    // This makes it so you can't remove yourself from a team
    // in the edit menu.
    this.hideOwnUser = function(user) {
      return (user.$id === FirebaseFactory.getCurrentUser().uid);
    }
  })
  
  // Filter for searching team names
  .filter('teamSearch', function(){

    return function(arr, searchString){

      if(!searchString){
        return arr;
      }

      var result = [];

      searchString = searchString.toLowerCase();

      // Using the forEach helper method to loop through the array
      angular.forEach(arr, function(item){
        if(item !== null && item !== undefined && 
           item.$id.toLowerCase().indexOf(searchString) !== -1) {
          result.push(item);
        }

      });

      return result;
    }
  });
})();
