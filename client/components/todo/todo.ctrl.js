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

  $scope.addTask = function(taskNum) {
    if($scope.inputFields[taskNum] === '') return;

    var now = moment().format('MMMM Do YYYY, h:mm a');

    $scope.lists[taskNum] = [{
      content: $scope.inputFields[taskNum],
      date: now,
      statusClass: 'success',
      tagName: 'Tag!!!'
    }].concat($scope.lists[taskNum]);
    $scope.inputFields[taskNum] = '';
  }

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

  $scope.lists = [];

  $scope.sometext = "hi"

  if ($rootScope.selectedTeam) {
    $scope.lists[0] = FirebaseFactory.getCollection(['todo', 0]);
    $scope.lists[1] = FirebaseFactory.getCollection(['todo', 1]);
    $scope.lists[2] = FirebaseFactory.getCollection(['todo', 2]);
  }

  $scope.sortableOptions = {
    connectWith: ".connectList"
  };
  });
})();

