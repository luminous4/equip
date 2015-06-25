/*
* Documents Controller
* */

angular.module('equip')
	.controller('DocumentCtrl', function($scope, $rootScope, FirebaseFactory){
		$rootScope.$watch('selectedTeam', function(){
			if($rootScope.selectedTeam) {
				var documentList = FirebaseFactory.getCollection('documents');
				$scope.documentList = documentList;
				$scope.documentWidget = documentList.$loaded().then(function(data){
					$scope.documentWidget = data.reverse().slice(0, 5);
				});
			}
		});
	});