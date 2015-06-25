// make a list of all people on all your teams
// get all of those users' data and store it in allUsers
// loop through when you add or splice 
// when you save changes, translate it into the format teams already use

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
    this.editingTeam = {};
    this.editingTeamUserlist = [];

    //Functions
      //Navigation
    this.setTab = function(tabNumber) {
      this.currentTab = this.tabs[tabNumber];
      if(tabNumber === 1) {
        this.editingTeam = {
          name: "Team Title",
          label: "",
          users: [],
          calendarEvents: []
        };
      }
    }
    this.editTeam = function(team) {
      console.log(team);
      this.setTab(2);
      this.editingTeam = team;
      var keys = Object.keys(team.users);
      var ref = new Firebase(refUrl);
      for(var i = 0; i < keys.length; i++) {
        for(var j = 0; j < this.allUsers.length; j++) {
          if(team.users[keys[i]].$id === this.allUsers[j].$id){
            this.editingTeamUserlist.push(user)          
          }
        }
      }
    }

      //Editing functions
    this.flipPresence = function(user) {
      if(!this.editingTeam.users) {
        this.editingTeam.users = [];
      }

      if(this.editingTeamUserlist.indexOf(user) === -1) {
        this.editingTeamUserlist.push(user);
        console.log(this.editingTeamUserlist);
      } else {
        this.editingTeamUserlist.splice(this.editingTeamUserlist.indexOf(user), 1);
      }

      // if(this.editingTeam.users[])
    }
    this.createTeamSubmit = function() {
      var newRef = FirebaseFactory.addToCollection(this.editingTeam);

      this.editingTeam = {
        name: "Team Title",
        label: "",
        users: [],
        calendarEvents: [],
        completion: null
      };
      this.setTab(0);
    }
    this.editProjectSubmit = function(toDelete) {

      var that = this;

      if(toDelete) {
        FirebaseFactory.removeItem(['projects', that.editingProject.$id]);
        that.setTab(0);
        return;
      }

      FirebaseFactory.removeItem(['teams', that.editingTeam.$id]);

      that.setTab(0);

    }

      //UI functions
    this.getUserPicture = function(userId) {
      console.log(this.editingTeamUserlist);
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
