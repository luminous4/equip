angular.module('equip')

  .factory('FirebaseFactory', function($firebaseArray, $firebaseObject, $window, refUrl) {
    var ref = new Firebase(refUrl);

    var firebaseSterilization = function(input) {
      if(input["$$hashKey"] !== undefined)     delete input["$$hashKey"];
      if(input["$id"] !== undefined)           delete input["$id"];
      if(input["$priority"] !== undefined)     delete input["$priority"];

      for(var key in input) {
        if(input[key] === undefined) {
          delete(input[key]);
        }
      }

      return input;
    }

    var translateReference = function(input) {
      if(Array.isArray(input)) {
        var result = ref;
        for(var i = 0; i < input.length; i++) {
          result = result.child(input[i]);
        }
        return result;
      } else {
        return ref.child(input);
      }
    }

    var getCollection = function(target) {
      return $firebaseArray(translateReference(target));
    };

    var addToCollection = function(collection, newItem) {
      newItem = firebaseSterilization(newItem);

      var targetCollection = translateReference(collection);
      targetCollection.push(newItem);
      console.log('added to:', collection);
    };

    var updateItem = function(collection, item, newObject) {
      var editId = item.$id;

      newObject = firebaseSterilization(newObject);
      console.log(newObject);

      var targetArray = [collection, editId];

      var targetItem = translateReference(targetArray);

      targetItem.update(newObject);
      console.log('just edited:', targetItem);
    };

    var removeItem = function (collection, item) {

      var editId = item.$id;

      var targetArray = [collection, editId];

      var targetItem = translateReference(targetArray);

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
