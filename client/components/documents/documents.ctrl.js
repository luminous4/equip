(function() {
	angular.module('equip')
		.controller('DocumentCtrl', function ($scope, $rootScope, $http, FirebaseFactory, Transloadit, $ocLazyLoad) {
			// Load Jquery Plugin
			$ocLazyLoad.load('components/documents/documents.jq.js');
			// Teams
			$rootScope.$watch('selectedTeam', function () {
				if ($rootScope.selectedTeam) {
					var documentList = FirebaseFactory.getCollection('documents');
					$scope.documentList = documentList;
					$scope.documentWidget = documentList.$loaded().then(function (data) {
						$scope.documentWidget = data.reverse().slice(0, 5);
					});
				}
			});
		});
})();