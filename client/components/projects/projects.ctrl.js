// angular controller
  // crud functions that will eventually get info from and send to firebase
  // ng-repeat for each project

  // factory to keep state

  // may need a form for creating a new project
    // createproject.ctrl.js

(function() {
  angular.module('equip')

  .controller('ProjectController', function($scope, $state, $stateParams, FirebaseFactory, 
                                            $firebaseArray, refUrl, $firebaseObject) {

    var ref = new Firebase(refUrl);
    this.projects = $firebaseArray(ref.child('projects'));
    this.allUsers = $firebaseArray(ref.child('users'));

    this.tabs = [
      'Project List',
      'Create A Project',
      'Edit Project'
    ];
    this.currentTab = 'Project List';
    this.searchString = '';

    //Functions
      //Navigation
    this.setTab = function(tabNumber) {
      this.currentTab = this.tabs[tabNumber];
      if(tabNumber === 1) {
        this.editingProject = {
          name: 'Project Title',
          label: '',
          userList: [],
          calendarEvents: [],
          completion: null
        };
      }
    }
    this.editProject = function(project) {
      this.setTab(2);
      this.editingProject = project;
    }

      //Editing functions
    this.flipPresence = function(user) {
      if(!this.editingProject.userList) {
        this.editingProject.userList = [];
      }
      if(this.editingProject.userList.indexOf(user.$id) > -1) {
        this.editingProject.userList.splice(this.editingProject.userList.indexOf(user.$id), 1);
      } else {
        this.editingProject.userList.push(user.$id);
      }
    }
    this.createProjectSubmit = function() {
      var that = this;
      FirebaseFactory.addToCollection('projects', that.editingProject);

      this.editingProject = {
        name: 'Project Title',
        label: '',
        userList: [],
        calendarEvents: [],
        completion: 10
      }
      this.setTab(0);
    }
    this.editProjectSubmit = function(toDelete) {

      var that = this;

      if(toDelete) {
        FirebaseFactory.removeItem(['projects', that.editingProject.$id]);
        that.setTab(0);
        return;
      }

      FirebaseFactory.updateItem(['projects', that.editingProject.$id], that.editingProject);

      that.setTab(0);    
    }

      //UI functions
    this.getUserPicture = function(userId) {
      if(userId === null || userId === undefined) return 'img/user.png';
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
        if(item !== null && item !== undefined && item.name.toLowerCase().indexOf(searchString) !== -1){
          result.push(item);
        }

      });

      return result;
    }
  });
})();
