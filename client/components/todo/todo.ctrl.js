(function() {
  angular.module('equip')

  .controller('TodoController', function($scope, $state, $stateParams, FirebaseFactory,
                      $firebaseArray, $timeout,  $rootScope, refUrl, $firebaseObject) {

  $scope.sortableOptions = {
    connectWith: ".connectPanels",
    handler: ".ibox-title"
  };


  $scope.lists = [
    [
      {
        content: 'Packages and web page editors now use Lorem Ipsum as',
        date: '08.04.2015',
        statusClass: 'warning',
        tagName: 'Mark'
      },
      {
        content: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default.',
        date: '05.04.2015',
        statusClass: 'success',
        tagName: 'Tag'
      },
      {
        content: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
        date: '16.11.2015',
        statusClass: 'info',
        tagName: 'Tag'
      }
    ], [
      {
        content: 'Quisque lacinia tellus et odio ornare maximus.',
        date: '05.04.2015',
        statusClass: 'success',
        tagName: 'Mark'
      },
      {
        content: 'Enim mollis accumsan in consequat orci.',
        date: '11.04.2015',
        statusClass: 'danger',
        tagName: 'Tag'
      }
    ], [
      {
        content: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default.',
        date: '05.04.2015',
        statusClass: 'success',
        tagName: 'Mark'
      },
      {
        content: 'Sometimes by accident, sometimes on purpose (injected humour and the like).',
        date: '16.11.2015',
        statusClass: 'info',
        tagName: 'Tag'
      },
      {
        content: 'Simply dummy text of the printing and typesetting industry.',
        date: '12.10.2015',
        statusClass: 'warning',
        tagName: 'Mark'
      },
      {
        content: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default.',
        date: '05.04.2015',
        statusClass: 'success',
        tagName: 'Mark'
      }
    ], [

    ], [

    ]
  ];

  $scope.sortableOptions = {
    connectWith: ".connectList"
  };
  });
})();

