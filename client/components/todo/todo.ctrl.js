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
      $scope.lists[0] = furtherSterilization(tempList0);
    });
    $scope.lists[1] = FirebaseFactory.getCollection(['todo', 1]);
    $scope.lists[2] = FirebaseFactory.getCollection(['todo', 2]);
  } 

  // Options for sortableui directive
  $scope.sortableOptions = {
    connectWith: ".connectList",
    // update: function(e, ui) {
    //   updateFirebaseTodos();
    // }
  };

    /////////////////////////
    /// Utility functions ///
    /////////////////////////

  // Updates firebase with the entire todo list dataset
  var updateFirebaseTodos = function() {
    var thisTeam = $rootScope.selectedTeam;

    for(var i = 0; i < 5; i++) {

      if($scope.lists[i] === undefined) continue;
      var duplicatesHash = {};

      var newList = $scope.lists[i].slice();

      var path = refUrl + '/teams/' + thisTeam.$value + '/todo/' + i;
      var ref = new Firebase(path);
      var repeatHash = {};
      var newestList = [];

      for(var j = 0; j < newList.length; j++) {
        newList[j] = furtherSterilization(newList[j]);
        if(!duplicatesHash[newList[j].content]) {
          duplicatesHash[newList[j].content] = true;
          newestList.push(newList[j]);
        } 
      }

      // newList = furtherSterilization(newList);
      ref.set(newestList);
    }
  }

  // Sterilization method which could definitely go into the 
  // FirebaseFactory 
  var furtherSterilization = function(input) {
    if (input['$$added'] !== undefined)     delete input['$$added'];
    if (input['$$error'] !== undefined)     delete input['$$error'];
    if (input['$$getKey'] !== undefined)    delete input['$$getKey'];
    if (input['$$moved'] !== undefined)     delete input['$$moved'];
    if (input['$$notify'] !== undefined)    delete input['$$notify'];
    if (input['$$process'] !== undefined)   delete input['$$process'];
    if (input['$$removed'] !== undefined)   delete input['$$removed'];
    if (input['$$updated'] !== undefined)   delete input['$$updated'];
    if (input['$add'] !== undefined)        delete input['$add'];
    if (input['$destroy'] !== undefined)    delete input['$destroy'];
    if (input['$destroy'] !== undefined)    delete input['$destroy'];
    if (input['$getRecord'] !== undefined)  delete input['$getRecord'];
    if (input['$indexFor'] !== undefined)   delete input['$indexFor'];
    if (input['$keyAt'] !== undefined)      delete input['$keyAt'];
    if (input['$loaded'] !== undefined)     delete input['$loaded'];
    if (input['$ref'] !== undefined)        delete input['$ref'];
    if (input['$remove'] !== undefined)     delete input['$remove'];
    if (input['$save'] !== undefined)       delete input['$save'];
    if (input['$watch'] !== undefined)      delete input['$watch'];
    if (input['$$hashKey'] !== undefined)   delete input['$$hashKey'];
    if (input['$id'] !== undefined)         delete input['$id'];
    if (input['$priority'] !== undefined)   delete input['$priority'];
    return input;
  }
  });
})();
