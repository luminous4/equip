// alternative ways to track who should be put on and off the team:
// 1. remember everyone involved
// 2. if they ended up in it, make sure it's in there
// 3. if not, make sure it's not
// 4. ugh

(function() {
  angular.module('equip')

  .controller('TeamController', function($scope, $state, $stateParams, FirebaseFactory,
                                            $firebaseArray, refUrl, $firebaseObject) {

    this.teams = FirebaseFactory.getCollection('teams', true);
    this.allUsers = FirebaseFactory.getCollection('users', true);

    this.tabs = [
      "Team List",
      "Create A Team",
      "Edit Team"
    ];
    this.currentTab = "Team List";
    this.searchString = "";
    this.editingTeam = {
      $id: "Team Title",
      users: [],
      calendarEvents: []
    };
    this.editingTeamUserlist = [];

    //Functions
      //Navigation
    this.setTab = function(tabNumber, team) {
      
      this.currentTab = this.tabs[tabNumber];

      if(tabNumber === 1) {
        this.editingTeam = {
          $id: "Team Title",
          users: [],
          calendarEvents: []
        };
        this.editingTeamUserlist = [];

      } else if(tabNumber === 2) {
        
        this.editingTeam = team;
        this.editingTeamUserlist = [];

        var keys = Object.keys(team.users);
        var allKeys = [];
        for(var i = 0; i < this.allUsers.length; i++) {
          allKeys.push(this.allUsers[i].$id);
        }
        for(var i = 0; i < keys.length; i++) {
          this.editingTeamUserlist.push(FirebaseFactory.getObject([ 'users', team.users[keys[i]] ], true) );
        }

        this.allUsers = [];      

        for(var i = 0; i < allKeys.length; i++) {
          this.allUsers.push(FirebaseFactory.getObject([ 'users', allKeys[i]], true));
        }

        // maybe i need to re-get allUsers when i reload tab 0, or just put it in the
        // switch tab func

        console.log(this.editingTeamUserlist);
      }
    }

      //Editing functions
    this.flipPresence = function(user) {
      if(!this.editingTeam.users) {
        this.editingTeam.users = [];
      }

      var thisGuyIsAlreadyHere = false;
      var thisGuyIndex = -1;

      for(var i = 0; i < this.editingTeamUserlist.length; i++) {
        console.log('user');
        console.log(user);
        console.log('editingTeamUserlist[i]');
        console.log(this.editingTeamUserlist[i]);
        if(user.$id === this.editingTeamUserlist[i].$id) {
          thisGuyIsAlreadyHere = true;
          thisGuyIndex = i;
        }
      }

      if(thisGuyIsAlreadyHere) {
        this.editingTeamUserlist.splice(thisGuyIndex, 1);
      } else {
        this.editingTeamUserlist.push(user);
      }
    }
    this.createTeamSubmit = function() {
      var usersList = [];

      for(var i = 0; i < this.editingTeamUserlist.length; i++) {
        usersList.push(this.editingTeamUserlist[i].$id);
      }

      FirebaseFactory.updateItem(['teams', this.editingTeam.$id], {users: usersList}, true);

      this.editingTeam = {
        $id: "Team Title",
        users: [],
        calendarEvents: []
      };

      this.setTab(0);
    }
    this.editTeamSubmit = function(toDelete) {
      var usersList = [];

      if(toDelete) {
        FirebaseFactory.removeItem(['teams', this.editingTeam.$id], true);
        this.setTab(0);
        return;
      }

      for(var i = 0; i < this.allUsers.length; i++) {
        FirebaseFactory.removeItem(['users', this.allUsers[i].$id, 'teams', this.editingTeam.$id], true);
      }
      for(var i = 0; i < this.editingTeamUserlist.length; i++) {
        console.log(this.editingTeamUserlist[i]);
        FirebaseFactory.addToCollection(['users', this.editingTeamUserlist[i].$id, 'teams'], this.editingTeam.$id, true);
        usersList.push(this.editingTeamUserlist[i].$id);
      }

      FirebaseFactory.updateItem(['teams', this.editingTeam.$id], {users: usersList}, true);

      this.setTab(0);
    }

      //UI functions
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

    this.getUsername = function(userId) {
      if(userId === null || userId === undefined) return "Unknown user";

      for(var i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].$id === userId) {
          return this.allUsers[i].displayName;
        }
      }
    }
  })

  .filter('teamSearch', function(){

    return function(arr, searchString){

      if(!searchString){
        return arr;
      }

      var result = [];

      searchString = searchString.toLowerCase();

      // Using the forEach helper method to loop through the array
      angular.forEach(arr, function(item){
        if(item !== null && item !== undefined && item.$id.toLowerCase().indexOf(searchString) !== -1){
          result.push(item);
        }

      });

      return result;
    }
  });
})();
