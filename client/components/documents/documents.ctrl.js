/*
* Documents Controller
* */

angular.module('equip')
	.controller('DocumentCtrl', function($scope, $rootScope, FirebaseFactory){
		$rootScope.$watch('selectedTeam', function(){
			if($rootScope.selectedTeam) {
				var documentList = FirebaseFactory.getCollection('documents');
				$scope.documentList = documentList;
			}
		});
	});