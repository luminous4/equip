// angular controller
  // crud functions that will eventually get info from and send to firebase 
  // ng-repeat for each project

  // factory to keep state 

  // may need a form for creating a new project
    // createproject.ctrl.js

(function() {
  angular.module('equip')
    .controller('ProjectController', function() {

      //Some dummy data
      var userArray = [
        {
          name: 'Giraffe',
          icon: 'img/giraffe.jpg'
        }, {
          name: "Pig",
          icon: 'img/pig.png'
        }, {
          name: "Duck",
          icon: "img/duck.jpg"
        }
      ];

      var projectArray = [
        {
          name: 'Rebuild the zoo',
          label: 'Zoo',
          userList: userArray,
          calendarEvents: [],
          completion:70
        },
        {
          name: 'Eat garbage',
          label: 'Zoo',
          userList: [
            {
              name: "Pig",
              icon: 'img/pig.png'
            },
          ],
          calendarEvents: [],
          completion:40
        }  
      ];

      this.projects = projectArray;
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
