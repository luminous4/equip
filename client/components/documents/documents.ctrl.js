/*
* Documents Controller
* */

angular.module('equip')
	.controller('DocumentCtrl', function($scope, FirebaseFactory){
		var documentList = FirebaseFactory.getCollection('documents', true);
		console.log(documentList);
});