// angular controller
  // crud functions that will eventually get info from and send to firebase 
  // ng-repeat for each project

  // factory to keep state 

  // may need a form for creating a new project
    // createproject.ctrl.js

(function() {
  angular.module('equip')
    .controller('ProjectController', function() {
      var projectArray = [
        {
          name: 'Rebuild the zoo',
          label: 'Zoo',
          userList: [
            {
              name: 'Giraffe',
              icon: 'img/giraffe.jpg'
            },
            {
              name: "Pig",
              icon: 'img/pig.png'
            },
            {
              name: "Duck",
              icon: "img/duck.jpg"
            }
          ],
          calendarEvents: []
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
          calendarEvents: []
        }  
      ];

      this.projects = projectArray;
      this.hello = "hello there!";
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

          if(item.title.toLowerCase().indexOf(searchString) !== -1){
            result.push(item);
          }

        });

        return result;
      }
    });
})();
