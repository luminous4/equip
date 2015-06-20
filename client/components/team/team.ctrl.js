(function() {
  angular.module('equip')

  .controller('TeamController', function($scope, $state, $stateParams, 
                                            $firebaseArray, refUrl, $firebaseObject) {

    var ref = new Firebase(refUrl);
    this.allUsers = $firebaseArray(ref.child("users"));
    this.allClients = $firebaseArray(ref.child("clients"));
  
    this.clientEditMode = false;

  });
})();