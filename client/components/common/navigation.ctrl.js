angular.module('equip')

.controller('NavCtrl', function($scope, $window, refUrl) {

  var userObj = $window.localStorage.getItem('firebase:session::mksequip');
  var userId = JSON.parse(userObj).uid;

  var ref = new Firebase(refUrl);

  var getUser = function(fb, cb) {
    fb.child('users').child(userId).once("value", function(data) {
      cb(data.val().displayName, data.val().imgUrl);
    });
  };

  if (!$scope.name && !$scope.img) {
    getUser(ref, function(name, img) {
      $scope.name = name;
      $scope.img = img;
    });    
  }

})