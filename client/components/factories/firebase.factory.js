angular.module('equip')

  .factory('FirebaseFactory', function($firebaseArray, $rootScope, $firebaseObject, $window, refUrl) {
    var ref = new Firebase(refUrl);

    var firebaseSterilization = function(input) {
      if(input['$$hashKey'] !== undefined) {
        delete input['$$hashKey'];
      }

      if(input['$id'] !== undefined) {
        delete input['$id'];
      }

      if(input['$priority'] !== undefined) {
        delete input['$priority'];
      }

      for(var key in input) {
        if(input[key] === undefined) {
          delete(input[key]);
        }
      }
      return input;
    };

    var translateReference = function(input, topLevel) {
      topLevel = !!topLevel;
      if(Array.isArray(input)) {
        var result = ref;
        if (!topLevel){
          result = ref.child('teams').child($rootScope.selectedTeam.$value);
        }
        for(var i = 0; i < input.length; i++) {
          result = result.child(input[i]);
        }
        return result;
      } else if (typeof input === 'string') {
          if (!topLevel) {
            return ref.child('teams').child($rootScope.selectedTeam.$value).child(input);
          }
          return ref.child(input);
      } else {
        return input; // input is a Firebase Reference Object
      }
    };

    var getCollection = function(path, topLevel) {
      return $firebaseArray(translateReference(path, topLevel));
    };

    var addToCollection = function(path, newItem, topLevel) {
      newItem = firebaseSterilization(newItem);
      var targetCollection = translateReference(path, topLevel);
      var addedItem = targetCollection.push(newItem);
      console.log('added to:', path);
      return addedItem;
    };

    var updateItem = function(path, newObject, topLevel) {
      newObject = firebaseSterilization(newObject);
      // console.log(newObject);
      var targetItem = translateReference(path, topLevel);
      targetItem.update(newObject);
      console.log('just edited:', targetItem);
    };

    var removeItem = function (path, topLevel) {
      var targetItem = translateReference(path, topLevel);
      targetItem.remove();
      console.log('removed:', targetItem);
    };

    var getCurrentUser = function() {
      var userObj = $window.localStorage.getItem('firebase:session::mksequip');
      var user = JSON.parse(userObj);
      return user;
    };

    var getCurrentTeamUserlist = function() {
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
    };

    return {
      getCollection: getCollection,
      addToCollection: addToCollection,
      updateItem: updateItem,
      removeItem: removeItem,
      getCurrentUser: getCurrentUser,
      getCurrentTeamUserlist: getCurrentTeamUserlist
    };
  })
