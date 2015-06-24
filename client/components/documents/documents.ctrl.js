/*
* Documents Controller
* */

angular.module('equip')
	.controller('DocumentCtrl', function($scope, FirebaseFactory){
		var documentList = FirebaseFactory.getCollection('documents') || [];
		$scope.documentList = documentList;

		console.log(documentList)

		/*Edit Product*/
		$scope.selectedDoc = null;
		$scope.editDoc = function(event) {
			console.log(event);
			//$state.go('index.texteditor', {title: });

		}
	});