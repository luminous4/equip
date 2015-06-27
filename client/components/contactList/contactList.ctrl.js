(function() {
  angular.module('equip')

  .controller('ContactController', function($scope, $state, $stateParams, FirebaseFactory,
                                            $firebaseArray, refUrl, $firebaseObject) {

    var currTeam = JSON.parse(localStorage.selectedTeam).$value;

    var teamUsers = FirebaseFactory.getCollection(['teams', currTeam,'users'], true);
    $scope.teamContacts = [];
    
    teamUsers.$loaded().then(function(){
      angular.forEach(teamUsers, function(user) {
        $scope.teamContacts.push(FirebaseFactory.getObject(['users', user.$value], true));
      })
    });

    this.currentContact = null;

    this.searchString = '';

    this.mainPageClass = "col-sm-12";
    this.sideViewClass = "col-sm-0";

    this.viewContact = function(contact) {
      this.mainPageClass = "col-sm-8";
      this.sideViewClass = "col-sm-4";
      this.currentContact = contact;
    }
    this.undisplayContact = function() {
      this.mainPageClass = "col-sm-12";
      this.sideViewClass = "col-sm-0";
      this.currentContact = null;
    }
    this.provided = function(infoPiece) {
      if (this.currentContact && this.currentContact[infoPiece]) {
        return true;
      } else {
        return false;
      }
    }
    this.getUserPhoneNumber = function(user) {
      if(user && user.phoneNumber) {
        var str = user.phoneNumber.toString();
        var end = "";
        for(var i = 0; i < str.length; i++) {
          if (i === 0) {
            end += "(";
          } else if (i === 3) {
            end += ") ";
          } else if (i === 6) {
            end += " - ";
          }
          end += str[i];
        }
        return end;
      } else return "Not provided";
    }

  })

  .filter('contactSearch', function(){

    return function(arr, searchString){

      if(!searchString){
        return arr;
      }

      var result = [];

      searchString = searchString.toLowerCase();

      // Using the forEach helper method to loop through the array
      angular.forEach(arr, function(item){
        console.log(item);
        if(item !== null && item !== undefined && item.displayName.toLowerCase().indexOf(searchString) !== -1){
          result.push(item);
        }

      });

      return result;
    }
  });
})();