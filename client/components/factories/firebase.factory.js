
angular.module('equip')

  .factory('FirebaseFactory', function($firebaseArray, $rootScope,
           $firebaseObject, $window, refUrl) {

    var ref = new Firebase(refUrl);

    // Decorator function which prepares data to be inserted into firebase
    var firebaseSterilization = function(input) {

      // Returns primitive types and arrays
      if (Object.keys(input).length < 1) {
        return input;
      }

      // Removes properties which firebase doesn't allow
      if (input['$$hashKey'] !== undefined) {
        delete input['$$hashKey'];
      }
      if (input['$id'] !== undefined) {
        delete input['$id'];
      }
      if (input['$priority'] !== undefined) {
        delete input['$priority'];
      }
      for (var key in input) {
        if (input[key] === undefined) {
          delete(input[key]);
        }
      }

      return input;
    };

    /*
    *  Returns a firebase reference.
    *  If topLevel is falsy, it traverses the tree from the root;
    *  otherwise, it will traverse starting at the currently selected team.
    *  Input takes an array or string. If input is an array, it will traverse
    *  down the tree using each member as the next child node to visit.
    */
    var translateReference = function(input, topLevel) {
      topLevel = !!topLevel;
      if (Array.isArray(input)) {
        var result = ref;
        if (!topLevel){
          result = ref.child('teams').child($rootScope.selectedTeam.$value);
        }
        for (var i = 0; i < input.length; i++) {
          result = result.child(input[i]);
        }
        return result;
      } else if (typeof input === 'string') {
          if (!topLevel) {
            return ref.child('teams').child($rootScope.selectedTeam.$value).child(input);
          }
          return ref.child(input);
      } else {
        return input;
      }
    };

    var getCollection = function(path, topLevel) {
      return $firebaseArray(translateReference(path, topLevel));
    };

    var getObject = function(path, topLevel) {
      return $firebaseObject(translateReference(path, topLevel));
    }

    var addToCollection = function(path, newItem, topLevel) {
      newItem = firebaseSterilization(newItem);
      var targetCollection = translateReference(path, topLevel);
      var addedItem = targetCollection.push(newItem);
      addedItem = $firebaseObject(addedItem);
      return addedItem;
    };

    var updateItem = function(path, newObject, topLevel) {
      newObject = firebaseSterilization(newObject);
      var targetItem = translateReference(path, topLevel);
      targetItem.update(newObject);
    };

    var removeItem = function (path, topLevel) {
      var targetItem = translateReference(path, topLevel);
      targetItem.remove();
    };

    return {
      addToCollection: addToCollection,
      getCollection: getCollection,
      getObject: getObject,
      removeItem: removeItem,
      updateItem: updateItem,
      firebaseSterilization: firebaseSterilization
    };
  })