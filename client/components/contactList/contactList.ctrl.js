(function() {
  angular.module('equip')

  .controller('ContactController', function($scope, $rootScope, $state, $stateParams, $firebaseObject,
                                            $firebaseArray, refUrl, FirebaseFactory) {

    $rootScope.goToTop();

    $scope.currentContact = null;
    $scope.loading = true;
    $scope.searchString = '';
    $scope.mainPageClass = "col-sm-12";
    $scope.sideViewClass = "col-sm-0";

     $rootScope.$watch('selectedTeam', function() {
    if ($rootScope.selectedTeam) {
      var currTeam = JSON.parse(localStorage.selectedTeam).$value;
      var teamUsers = FirebaseFactory.getCollection(['teams', currTeam, 'users'], true);
      $scope.teamContacts = [];
      teamUsers.$loaded().then(function() {
        $scope.loading = false;
        angular.forEach(teamUsers, function(user) {
          $scope.teamContacts.push(FirebaseFactory.getObject(['users', user.$value], true));
        })
      });
    }
  });

    // Displays a contact on the side and shrinks list
    $scope.viewContact = function(contact) {
      $scope.mainPageClass = "col-sm-8";
      $scope.sideViewClass = "col-sm-4";
      $scope.currentContact = contact;
    }

    // Removes contact on the side from being displayed and makes the list larger
    $scope.undisplayContact = function() {
      $scope.mainPageClass = "col-sm-12";
      $scope.sideViewClass = "col-sm-0";
      $scope.currentContact = null;
    }

    $scope.provided = function(infoPiece) {
      if ($scope.currentContact && $scope.currentContact[infoPiece]) {
        return true;
      } else {
        return false;
      }
    }

    $scope.getUserPhoneNumber = function(user) {
      if (user && user.phoneNumber) {
        var str = user.phoneNumber.toString();
        var end = "";
        for(var i = 0; i < str.length; i++) {
          if (i === 0) {
            end += "";
          } else if (i === 3) {
            end += "-";
          } else if (i === 6) {
            end += "-";
          }
          end += str[i];
        }
        return end;
      } else return "Not provided";
    }
  })

  .filter('contactSearch', function() {
    return function(arr, searchString) {
      if (!searchString) {
        return arr;
      }
      var result = [];
      searchString = searchString.toLowerCase();
      // Using the forEach helper method to loop through the array
      angular.forEach(arr, function(item) {
        if (item !== null && item !== undefined && item.displayName.toLowerCase().indexOf(searchString) !== -1) {
          result.push(item);
        }
      });
      return result;
    }
  });
})();
