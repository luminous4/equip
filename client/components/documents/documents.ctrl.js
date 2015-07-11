(function() {
	angular.module('equip')
		.controller('DocumentCtrl', function ($scope, $rootScope, $http, FirebaseFactory, Transloadit, $ocLazyLoad) {
			$rootScope.goToTop();
			// Load Jquery Plugin
			$ocLazyLoad.load('components/documents/documents.compiled.js');
			// Teams
			$rootScope.$watch('selectedTeam', function () {
				if ($rootScope.selectedTeam) {
					window.selectedTeam = $rootScope.selectedTeam.$value;
					//$scope.
					var documentList = FirebaseFactory.getCollection('documents');
					$scope.documentList = documentList;
					$scope.documentWidget = documentList.$loaded().then(function (data) {
						$scope.documentWidget = data.reverse().slice(0, 5);
					});
					// images
					var imageList = FirebaseFactory.getCollection('images');
					$scope.imageList = imageList;
				}
			});
		});
})();