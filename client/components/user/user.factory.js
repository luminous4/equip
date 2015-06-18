angular.module('equip');

var Firebase = require('firebase');
var refUrl = 'https://mksequip.firebaseapp.com';
var ref = new Firebase(refUrl);


  .factory('User', '$firebaseSimpleLogin'function() {
    var login = function(email, password) {
      var username = email;
      var password = password;

      loginObj.$login('password', {
            email: username,
            password: password
        })
        .then(function(user) {
            // Success callback
            console.log('Authentication successful');
        }, function(error) {
            // Failure callback
            console.log('Authentication failure');
        });

    };

    var register = function() {

    };

    return {
      login: login,
      register: register
    };
  })