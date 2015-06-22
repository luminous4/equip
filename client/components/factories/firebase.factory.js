angular.module('equip')

  .factory('FirebaseFactory', function($firebaseArray, $firebaseObject, $window, refUrl) {
      var ref = new Firebase(refUrl);

      var getCollection = function(target) {
        return $firebaseArray(ref.child(target));
      };

      var addToCollection = function(collection, newItem) {
        var targetCollection = ref.child(collection);
        targetCollection.push(newItem);
        console.log('added to:', collection);
      };

      // Todo
      var editCollection = function(collection, itemID, newValue) {
        var targetItem = $firebaseObject(ref.child(collection).child(itemID));
        targetItem.$save(newValue);
        console.log('edits', targetItem);
      };

      // Todo
      var removeItem = function (collection, itemID) {
        var targetItem = $firebaseObject(ref.child(collection).child(itemID));
        targetItem.$save();
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
      editCollection: editCollection,
      removeItem: removeItem,
      getCurrentUser: getCurrentUser
    };
  })
