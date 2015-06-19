angular.module('equip')

  .controller('HomeCtrl', function($scope, User) {

    console.log('token available in homeCtrl:', User.isAuth());
  })