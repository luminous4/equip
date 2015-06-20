// angular controller
  // crud functions that will eventually get info from and send to firebase
  // ng-repeat for each project

  // factory to keep state

  // may need a form for creating a new project
    // createproject.ctrl.js

(function() {
  angular.module('equip')

  .controller('ProjectController', function($scope, $state, $stateParams, $firebaseArray, refUrl) {

    var ref = new Firebase(refUrl);
    this.projects = $firebaseArray(ref.child("projects"));
    this.allUsers = $firebaseArray(ref.child("users"));

    this.tabs = [
      "Project List",
      "Create A Project",
      "Edit Project"
    ];
    this.currentTab = "Project List";
    this.searchString = "";

    //Functions
      //Navigation
    this.setTab = function(tabNumber) {
      this.currentTab = this.tabs[tabNumber];
    }
    this.editProject = function(project) {
      this.setTab(2);
      this.editingProject = project;
    }

      //Editing functions
    this.flipPresence = function(user) {
      if(this.editingProject.userList.indexOf(user.$id) > -1) {
        this.editingProject.userList.splice(this.editingProject.userList.indexOf(user.$id), 1);
      } else {
        this.editingProject.userList.push(user.$id);
      }
    }
    this.createProjectSubmit = function() {
      var ref = new Firebase(refUrl);
      var projectsRef = ref.child("projects");
      
      var newProjectRef = projectsRef.push(this.editingProject);

      this.editingProject = {
        name: "Project Title",
        label: "",
        userList: [],
        calendarEvents: [],
        completion: 10
      }
      this.setTab(0);
    }
    this.editProjectSubmit = function() {
      var ref = new Firebase(refUrl);
      var projectsRef = ref.child("projects");
      

      projectsRef.$save(this.editingProject)
        .then(function() {
          this.editingProject = {
            name: "Project Title",
            label: "",
            userList: [],
            calendarEvents: [],
            completion: 10
          }
          this.setTab(0);
        });
    }

      //UI functions
    this.getUserPicture = function(userId) {
      for(var i = 0; i < this.allUsers.length; i++) {
        console.log(this.allUsers[i].$id);
        console.log(userId);
        if(this.allUsers[i].$id.toString() === userId.toString()) {
          console.log(this.allUsers[i].imgUrl);
          return this.allUsers[i].imgUrl;
        }
      }
      return "";
    }

      //Initialization
    this.editingProject = {
      name: "Project Title",
      label: "",
      userList: [],
      calendarEvents: [],
      completion: 10
    };

  })
  .filter('projectSearch', function(){

    return function(arr, searchString){

      if(!searchString){
        return arr;
      }

      var result = [];

      searchString = searchString.toLowerCase();

      // Using the forEach helper method to loop through the array
      angular.forEach(arr, function(item){

        if(item.name.toLowerCase().indexOf(searchString) !== -1){
          result.push(item);
        }

      });

      return result;
    }
  });
})();
