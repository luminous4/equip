(function() {
  angular.module('equip')

  .controller('ContactController', function($scope, $state, $stateParams, FirebaseFactory,
                                            $firebaseArray, refUrl, $firebaseObject) {

    var that = this;

    var teamUsers = FirebaseFactory.getCollection('users');
    this.teamContacts = [];

    console.log(teamUsers);

    var ref = new Firebase(refUrl);
    
    teamUsers.$loaded().then(function(){
      angular.forEach(teamUsers, function(user) {
        console.log(teamUsers);
        that.teamContacts.push($firebaseObject(ref.child('users').child(user.$id)));
      })
      console.log(that.teamContacts); 
    });


    this.currentContact = null;

    this.searchString = '';

    this.mainPageClass = "col-sm-12";
    this.sideViewClass = "col-sm-0";

    this.viewContact = function(contact) {
      this.mainPageClass = "col-sm-8";
      this.sideViewClass = "col-sm-4";
      console.log('viewing');
      console.log(contact);
      this.currentContact = contact;
    }
    this.undisplayContact = function() {
      console.log('halp');
      this.mainPageClass = "col-sm-12";
      this.sideViewClass = "col-sm-0";
      this.currentContact = null;
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
        if(item !== null && item !== undefined && item.displayName.toLowerCase().indexOf(searchString) !== -1){
          result.push(item);
        }

      });

      return result;
    }
  });
})();