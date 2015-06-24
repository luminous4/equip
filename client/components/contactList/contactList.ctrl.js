(function() {
  angular.module('equip')

  .controller('ContactController', function($scope, $state, $stateParams, 
                                            $firebaseArray, refUrl, $firebaseObject) {
    var ref = new Firebase(refUrl);
    this.allUsers = $firebaseArray(ref.child('users'));
    console.log(this.allUsers);
    // this.allClients = $firebaseArray(ref.child('clients'));
    this.allClients = $firebaseArray(ref.child('clients'));

    this.clientEditMode = false;
    this.editingANewClient = false;

    this.tab = 1;

    this.currentClient = null;
    this.currentContact = null;

    this.searchString = '';

    // UI functions
    this.setTab = function(tab) {
      this.tab = tab;
      this.searchString = '';
    }
    this.viewUser = function(user) {
      this.currentContact = user;
    }
    this.viewClient = function(client) {
      this.clientEditMode = false;
      this.currentClient = client;
    }

    // CRUD functions 
    this.viewNewClient = function() {
      this.currentClient = {};
      this.clientEditMode = true;
      this.editingANewClient = true;
    }
    this.registerNewClient = function() {
      var ref = new Firebase(refUrl).child('clients');
      var newClientRef = ref.push(this.currentClient);

      this.currentClient = {};

      this.clientEditMode = false;
    }
    this.viewEditClient = function(client) {
      this.currentClient = client;
      this.clientEditMode = true;
      this.editingANewClient = false;
    }
    this.editClientSubmit = function(toDelete) {
      this.editingANewClient = false;
      this.clientEditMode = false;

      var that = this;

      var ref = new Firebase(refUrl + '/clients');

      var clientRef = $firebaseObject(ref.child(that.currentClient.$id));

      if(toDelete) {
        clientRef.$save();
        return;
      }

      var newClient = that.currentClient;

      if(newClient.name)        clientRef.name        = newClient.name;
      if(newClient.location)    clientRef.location    = newClient.location;
      if(newClient.nationality) clientRef.nationality = newClient.nationality;
      if(newClient.phoneNumber) clientRef.phoneNumber = newClient.phoneNumber;
      if(newClient.aboutMe)     clientRef.aboutMe     = newClient.aboutMe;
      
      clientRef.$save(newClient);
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