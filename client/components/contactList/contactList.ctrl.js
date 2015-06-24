(function() {
  angular.module('equip')

  .controller('ContactController', function($scope, $state, $stateParams, FirebaseFactory,
                                            $firebaseArray, refUrl, $firebaseObject) {

    this.allUsers = FirebaseFactory.getCollection('users', true);

    this.currentContact = null;

    this.searchString = '';

    this.viewUser = function(user) {
      this.currentContact = user;
    }

    this.getUserPicture = function(userId) {
      if(userId === null || userId === undefined) return 'img/user.png';
      if(userId.imgUrl !== undefined) return userId.imgUrl;
      for(var i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].$id.toString() === userId.toString()) {
          if(this.allUsers[i].imgUrl) {
            return this.allUsers[i].imgUrl;
          } else {
            return 'img/user.png';
          }
        }
      }
    }

    this.getClientPicture = function(clientId) {
      return 'http://sanantonioteaparty.us/wp-content/uploads/2014/09/Skynet.jpg';
    }

  });
})();