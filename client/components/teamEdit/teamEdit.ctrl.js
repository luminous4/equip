// angular controller
  // crud functions that will eventually get info from and send to firebase
  // ng-repeat for each team

  // factory to keep state

  // may need a form for creating a new team
    // createteam.ctrl.js

(function() {
  angular.module('equip')

  .controller('TeamController', function($scope, $state, $stateParams, FirebaseFactory,
                                            $firebaseArray, refUrl, $firebaseObject) {

    this.teams = FirebaseFactory.getCollection('teams', true);
    this.allUsers = FirebaseFactory.getCollection('users', true);

    console.log(this.teams);

    this.tabs = [
      "Team List",
      "Create A Team",
      "Edit Team"
    ];
    this.currentTab = "Team List";
    this.searchString = "";

    //Functions
      //Navigation
    this.setTab = function(tabNumber) {
      this.currentTab = this.tabs[tabNumber];
      if(tabNumber === 1) {
        this.editingTeam = {
          name: "Team Title",
          label: "",
          userList: [],
          calendarEvents: [],
          completion: null
        };
      }
    }
    this.editTeam = function(team) {
      this.setTab(2);
      this.editingTeam = team;
    }

      //Editing functions
    this.flipPresence = function(user) {
      if(!this.editingTeam.userList) {
        this.editingTeam.userList = [];
      }
      if(this.editingTeam.userList.indexOf(user.$id) > -1) {
        this.editingTeam.userList.splice(this.editingTeam.userList.indexOf(user.$id), 1);
      } else {
        this.editingTeam.userList.push(user.$id);
      }
    }
    this.createTeamSubmit = function() {
      var newRef = FirebaseFactory.addToCollection(this.editingTeam);

      this.editingTeam = {
        name: "Team Title",
        label: "",
        userList: [],
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
      if(userId === null || userId === undefined) return "img/user.png";
        if(userId.imgUrl !== undefined) return userId.imgUrl;

      for(var i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].$id.toString() === userId.toString()) {
          if(this.allUsers[i].imgUrl) {
            return this.allUsers[i].imgUrl;
          } else {
            return 'img/user.png';
          }
        }
      }
    }

  })
  .filter('search', function(){

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
