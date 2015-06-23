angular.module('equip')

  .factory('FirebaseFactory', function($firebaseArray, $firebaseObject, $window, refUrl) {
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

    var translateReference = function(input) {
      if(Array.isArray(input)) {
        var result = ref;
        for(var i = 0; i < input.length; i++) {
          result = result.child(input[i]);
        }
        return result;
      } else if (typeof input === 'string') {
          return ref.child(input);
      } else {
        return input; // input is a Firebase Reference Object
      }
    };

    var getCollection = function(path) {
      return $firebaseArray(translateReference(path));
    };

    var addToCollection = function(path, newItem) {
      newItem = firebaseSterilization(newItem);
      var targetCollection = translateReference(path);
      var addedItem = targetCollection.push(newItem);
      console.log('added to:', path);
      return addedItem;
    };

    var updateItem = function(path, newObject) {
      newObject = firebaseSterilization(newObject);
      // console.log(newObject);
      var targetItem = translateReference(path);
      targetItem.update(newObject);
      console.log('just edited:', targetItem);
    };

    var removeItem = function (path) {
      var targetItem = translateReference(path);
      targetItem.remove();
      console.log('removed:', targetItem);
    };

    var getCurrentUser = function() {
      var userObj = $window.localStorage.getItem('firebase:session::mksequip');
      var user = JSON.parse(userObj);
      return user;
    };

    return {
      getCollection: getCollection,
      addToCollection: addToCollection,
      updateItem: updateItem,
      removeItem: removeItem,
      getCurrentUser: getCurrentUser
    };
  })
