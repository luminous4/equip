// to do later:
// when you click submit, change all the users 
// when you delete a team, remove that team from all the users' team lists

(function() {
  angular.module('equip')

  .controller('TeamController', function($scope, $state, $stateParams, FirebaseFactory,
                                            $firebaseArray, refUrl, $firebaseObject) {

    //Initialize variables
    this.teams = FirebaseFactory.getCollection('teams', true);
    this.allUsers = FirebaseFactory.getCollection('users', true);
    this.tabs = [
      "Team List",
      "Create A Team",
      "Edit Team"
    ];
    this.currentTab = "Team List";
    this.searchString = "";


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

      if(tabNumber === 1) { 
        // Create A Team tab

        // Set the team being edited to an empty team
        this.editingTeam = {
          $id: "Team Title",
          users: [],
          calendarEvents: []
        };

      } else if (tabNumber === 2) { 
        // Edit Team tab
        
        // Set the team being edited to the clicked team
        this.editingTeam = team;

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

        // Get the information of all users 
        // Note: this is not scalable! We should fix later
        this.allUsers = [];      
        for(var i = 0; i < allKeys.length; i++) {
          this.allUsers.push(
            FirebaseFactory.getObject(
              [ 'users', allKeys[i]], 
              true)
          );
        }

      }
    }


      /////////////////////////
     // List edit functions //
    /////////////////////////


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

      // Add this team to firebase
      FirebaseFactory.updateItem(
        ['teams', this.editingTeam.$id], 
        {users: usersList}, 
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
      FirebaseFactory.removeItem(['teams', this.editingTeam.$id], true);

      // Remove this team from all its users
      for(var i = 0; i < this.editingTeamUserlist.length; i++ ){
        console.log(this.editingTeamUserlist);
        FirebaseFactory.removeItem(
          ['users', this.editingTeamUserlist[i].$id, 
            'teams', this.editingTeam.$id], 
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
        ['teams', this.editingTeam.$id], 
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
        console.log('added people');
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
