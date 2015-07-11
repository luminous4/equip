(function() {
  angular.module('equip')

  .controller('TodoController', function($scope, $state, $stateParams, FirebaseFactory,
                      $firebaseArray, $timeout,  $rootScope, refUrl, $firebaseObject) {
  $rootScope.goToTop();

  $scope.sortableOptions = {
    connectWith: ".connectPanels",
    handler: ".ibox-title"
  };

  var log = function() {
    console.log($scope.lists[0]);
  }

  setInterval(log, 3000);

  $scope.savedDisplay = "";
  $scope.listBools = [true,true,true,true];
  $scope.columnNames = ['Backlog','Ready to start','In progress','Done'];
  $scope.inputFields = ['','','',''];
  $scope.columnNameEdit = [false, false, false, false]
  $scope.tags = ['Issue', 'Important', 'Urgent', 'Info'];
  $scope.statuses = ['success', 'warning', 'danger', 'info'];
  $scope.lists = [];
  $scope.loading = true;
  $scope.firstLoad = true;

  // Utilities
  // Could go into fb factory?
  var furtherSterilization = function(input) {
    var keys = Object.keys(input);
    for(var i = 0; i < keys.length; i++) {
      if(keys[i].indexOf('$') > -1) {
        delete input[keys[i]];
      }
    }

    return input;
  }

  var objectify = function(input) {
    if(!Array.isArray(input)) return input;

    var newObj = {};

    for(var i = 0; i < input.length; i++) {
      newObj[i] = input[i];
    }

    return newObj;
  }

  var arrayify = function(input) {
    var array = [];

    var i = 0;
    while(input[i] !== undefined) {
      array.push(input[i]);
      i++;
    }

    return array;
  }

  $scope.loadEverything = function() {

    console.log('slk')



    if(!$scope.selectedTeam) return;

    var loadTodos = FirebaseFactory.getObject('todo');

    loadTodos.$loaded().then(function() {

      if(!loadTodos) {
        $scope.firstLoad = false;
        $scope.loading = false;
        return;
      } 

      var counter = 0;
      var whenEverythingIsLoaded = function() {
        counter++;
        if(counter > 4) {
          console.log('stuff is loaded!');
          if($scope.firstLoad) {
            $scope.firstLoad = false;
            $scope.loading = false;
          } else {
            $scope.showSavedDisplay();
          }
        }
      }

      var tempList0 = FirebaseFactory.getCollection(['todo', 0]);
      tempList0.$loaded().then(function() {
        whenEverythingIsLoaded();
        $scope.lists[0] = arrayify(furtherSterilization(tempList0));
        console.log('i made lists happen', $scope.lists[0]);
      });
      var tempList1 = FirebaseFactory.getCollection(['todo', 1]);
      tempList1.$loaded().then(function() {
        whenEverythingIsLoaded();
        $scope.lists[1] = arrayify(furtherSterilization(tempList1));
      });
      var tempList2 = FirebaseFactory.getCollection(['todo', 2]);
      tempList2.$loaded().then(function() {
        whenEverythingIsLoaded();
        $scope.lists[2] = arrayify(furtherSterilization(tempList2));
      });
      var tempList3 = FirebaseFactory.getCollection(['todo', 3]);
      tempList3.$loaded().then(function() {
        whenEverythingIsLoaded();
        $scope.lists[3] = arrayify(furtherSterilization(tempList3));
      });
      var columnNames = FirebaseFactory.getCollection(['todo', 'names']);
      columnNames.$loaded().then(function() {
        whenEverythingIsLoaded();
        if(columnNames[0]) $scope.columnNames[0] = columnNames[0].$value;
        if(columnNames[1]) $scope.columnNames[1] = columnNames[1].$value;
        if(columnNames[2]) $scope.columnNames[2] = columnNames[2].$value;
        if(columnNames[3]) $scope.columnNames[3] = columnNames[3].$value;
      });
    });
  }

  $scope.loadEverything();

  $rootScope.$watch('selectedTeam', function() {
    $scope.loadEverything();  
  });

  // Submits a form to the provided list to create a new task
  $scope.addTask = function(listNum) {
    if($scope.inputFields[listNum] === '') return;

    var now = moment().format('l');
    console.log(typeof now);
    var reg = new RegExp("(\d+/\d+/)\d\d(\d\d)/\1\2/");
    // now = reg.exec(now);
    console.log(now);

    $scope.lists[listNum] = [{
      content: $scope.inputFields[listNum],
      date: now,
      statusClass: 'success',
      tagName: 'Issue'
    }].concat($scope.lists[listNum]);

    $scope.inputFields[listNum] = '';

    // updateFirebaseTodos();
  }

  // Changes the current tag to the next tag. Also changes color
  $scope.cycleTag = function(task) {
    var newIndex = 0;
    for(var i = 0; i < $scope.statuses.length-1; i++) {
      if(task.statusClass === $scope.statuses[i]) {
        newIndex = i+1;
        break;
      }
    }
    task.tagName = $scope.tags[newIndex];
    task.statusClass = $scope.statuses[newIndex];
  }

  $scope.deleteTask = function(task, columnNumber) {
    for(var i = 0; i < $scope.lists[columnNumber].length; i++) {
      if($scope.lists[columnNumber][i].$$hashKey === task.$$hashKey) {
        $scope.lists[columnNumber].splice(i, 1);
        break;
      }
    }
  }

  $scope.editColumnName = function(columnNumber) {
    $scope.columnNameEdit[columnNumber] = true;
  }

  $scope.submitNewColumnName = function(columnNumber) {
    $scope.columnNameEdit[columnNumber] = false;
  }

  // Options for sortableui directive
  $scope.sortableOptions = {
    connectWith: ".connectList",
    // update: function(e, ui) {
    //   $scope.updateFirebaseTodos();
    // }
  };

    /////////////////////////
    /// Utility functions ///
    /////////////////////////

  // Updates firebase with the entire todo list dataset
  $scope.updateFirebaseTodos = function() {
    var thisTeam = $rootScope.selectedTeam;

    var endResult = {names:[]};

    for(var i = 0; i < 5; i++) {

      if($scope.lists[i] === undefined) continue;

      var newList = [];

      var j = 0;

      while($scope.lists[i][j] !== undefined) {
        $scope.lists[i].forEach(furtherSterilization);
        newList.push(objectify($scope.lists[i][j]));
        j++;
      }

      endResult[i] = newList;

      endResult.names[i] = $scope.columnNames[i];
    }


    FirebaseFactory.updateItem(['todo'], endResult);

    $scope.loadEverything();
  }

  $scope.showSavedDisplay = function() {
    if($scope.savedDisplay === "")
    var removeErrorMessage = function() {
      $scope.savedDisplay = "";
    }
    $scope.savedDisplay = "Saved!";
    $timeout(removeErrorMessage, 2000);
  }

  });
})();
