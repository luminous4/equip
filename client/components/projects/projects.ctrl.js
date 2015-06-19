// angular controller
  // crud functions that will eventually get info from and send to firebase
  // ng-repeat for each project

  // factory to keep state

  // may need a form for creating a new project
    // createproject.ctrl.js

(function() {
  angular.module('equip')

  .controller('ProjectController', function($scope, $state, $stateParams) {
    if(!$stateParams.authData) {
      $state.go('login');
    }

    var userArray = $firebaseArray(usersRef);
    var usersRef = new Firebase("https://mksequip.firebaseIO.com/users");

    var projectsRef = new Firebase("https://mksequip.firebaseio.com/projects");
    var projectsArray = $firebaseArray(projectsArray);

    this.projects = projectsArray;
    this.allUsers = userArray;

    this.tabs = [
      "Project List",
      "Create A Project",
      "Edit Project"
    ];
    this.currentTab = "Project List";
    this.searchString = "";

    //Functions
    this.setTab = function(tabNumber) {
      this.currentTab = this.tabs[tabNumber];
    }
    this.flipPresence = function(user) {
      if(this.editingProject.userList.indexOf(user) > -1) {
        this.editingProject.userList.splice(this.editingProject.userList.indexOf(user), 1);
      } else {
        this.editingProject.userList.push(user);
      }
    }
    this.editProject = function(project) {
      this.setTab(2);
      this.editingProject = project;
    }

    this.createProject = function() {
      
      projectsRef.push(this.editingProject);
      this.projects.push(angular.copy(this.editingProject));
      
      this.editingProject = {
        name: "Project Title",
        label: "",
        userList: [],
        calendarEvents: [],
        completion: 10
      }
      this.setTab(0);
    }

    //make this.editProject later

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
