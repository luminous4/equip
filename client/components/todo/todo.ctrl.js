(function() {
  angular.module('equip')

  .controller('TodoController', function($scope, $state, $stateParams, FirebaseFactory,
                      $firebaseArray, $timeout,  $rootScope, refUrl, $firebaseObject) {

  $scope.sortableOptions = {
    connectWith: ".connectPanels",
    handler: ".ibox-title"
  };

  $scope.listBools = [true,true,true,false,false];
  $scope.inputFields = ['','','','',''];
  $scope.tags = ['In progress', 'Urgent', 'Danger', 'Done'];
  $scope.statuses = ['success', 'warning', 'danger', 'info'];
  $scope.lists = [];

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

  // Loads stuff from firebase once
  if ($rootScope.selectedTeam) {
    var tempList0 = FirebaseFactory.getCollection(['todo', 0]);
    tempList0.$loaded().then(function() {
      $scope.lists[0] = arrayify(furtherSterilization(tempList0));
    });
    var tempList1 = FirebaseFactory.getCollection(['todo', 1]);
    tempList1.$loaded().then(function() {
      $scope.lists[1] = arrayify(furtherSterilization(tempList1));
    });
    var tempList2 = FirebaseFactory.getCollection(['todo', 2]);
    tempList2.$loaded().then(function() {
      $scope.lists[2] = arrayify(furtherSterilization(tempList2));
    });
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

    var endResult = {};

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

      console.log('newList');
      console.log(newList);

      endResult[i] = newList;
    }

    FirebaseFactory.updateItem(['todo'], endResult);

    // var path = refUrl + '/teams/' + thisTeam.$value + '/todo/' + i;
    // var ref = new Firebase(path);

    // ref.update(endResult);

    console.log('endResult');
    console.log(endResult);

    // show loading symbol while you refetch crap from the database

    var tempList0 = FirebaseFactory.getCollection(['todo', 0]);
    tempList0.$loaded().then(function() {
      $scope.lists[0] = arrayify(furtherSterilization(tempList0));
    });
    var tempList1 = FirebaseFactory.getCollection(['todo', 1]);
    tempList1.$loaded().then(function() {
      $scope.lists[1] = arrayify(furtherSterilization(tempList1));
    });
    var tempList2 = FirebaseFactory.getCollection(['todo', 2]);
    tempList2.$loaded().then(function() {
      $scope.lists[2] = arrayify(furtherSterilization(tempList2));
    });
  }

  // Sterilization method which could definitely go into the 
  // FirebaseFactory 
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

  });
})();
