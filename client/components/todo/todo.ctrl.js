(function() {
  angular.module('equip')

  .controller('TodoController', function($scope, $state, $stateParams, FirebaseFactory,
                      $firebaseArray, $timeout,  $rootScope, refUrl, $firebaseObject) {

  $scope.sortableOptions = {
    connectWith: ".connectPanels",
    handler: ".ibox-title"
  };

  $scope.savedDisplay = "";
  $scope.listBools = [true,true,true,false];
  $scope.columnNames = ['Backlog','Ready to start','In progress','Done'];
  $scope.inputFields = ['','','',''];
  $scope.columnNameEdit = [false, false, false, false]
  $scope.tags = ['Nonessential', 'Important', 'Urgent', 'Info'];
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
    // all this should be one function that gets called on save and also on load
    var counter = 0;
    var whenEverythingIsLoaded = function() {
      counter++;
      console.log($scope.loading);
      if(counter === 4) {
        if($scope.firstLoad) {
          console.log($scope.lists);
          $scope.firstLoad = false;
          $scope.loading = false;
          console.log($scope.loading);
        } else {
          $scope.showSavedDisplay();
        }
      }
    }

    var tempList0 = FirebaseFactory.getCollection(['todo', 0]);
    tempList0.$loaded().then(function() {
      console.log('0');
      $scope.lists[0] = arrayify(furtherSterilization(tempList0));
      whenEverythingIsLoaded();
    });
    var tempList1 = FirebaseFactory.getCollection(['todo', 1]);
    tempList1.$loaded().then(function() {
      console.log('1');
      $scope.lists[1] = arrayify(furtherSterilization(tempList1));
      whenEverythingIsLoaded();
    });
    var tempList2 = FirebaseFactory.getCollection(['todo', 2]);
    tempList2.$loaded().then(function() {
      console.log('2');
      $scope.lists[2] = arrayify(furtherSterilization(tempList2));
      whenEverythingIsLoaded();
    });
    var columnNames = FirebaseFactory.getCollection(['todo', 'names']);
    columnNames.$loaded().then(function() {
      console.log('3');
      $scope.columnNames[0] = columnNames[0].$value;
      $scope.columnNames[1] = columnNames[1].$value;
      $scope.columnNames[2] = columnNames[2].$value;
      whenEverythingIsLoaded();
    });
  }
  $rootScope.$watch('selectedTeam', function() {
    if ($rootScope && $rootScope.selectedTeam && $rootScope.selectedTeam.$value) {
      $scope.loadEverything();
    }
  });

  // Submits a form to the provided list to create a new task
  $scope.addTask = function(listNum) {
    if($scope.inputFields[listNum] === '') return;

    var now = moment().format('MMMM Do YYYY, h:mm a');

    $scope.lists[listNum] = [{
      content: $scope.inputFields[listNum],
      date: now,
      statusClass: 'success',
      tagName: 'Tag!!!'
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
        console.dir($scope.lists[i][j]);
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
