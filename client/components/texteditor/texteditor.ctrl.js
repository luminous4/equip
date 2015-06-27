(function(){
angular.module('equip')
	.controller('TextEditorCtrl', function ($scope, $firebaseObject, $stateParams,
                                          $state, User, FirebaseFactory) {

		$scope.documentId = $stateParams.documentId;
		$scope.documentTitle = $stateParams.documentTitle;
		$scope.documentBody = $stateParams.documentBody;
		$scope.document = {title: $scope.documentTitle, body: $scope.documentBody};

		$scope.saveDocument = function(){
			$scope.saveStatus = true;
			if ($stateParams.documentId) {
				FirebaseFactory.updateItem(['documents', $stateParams.documentId], {
					title: $scope.document.title,
					body : $scope.document.body
				});
			} else {
				$stateParams.documentId = FirebaseFactory.addToCollection('documents', {
						title: $scope.document.title,
						body: $scope.document.body
				});

				$stateParams.documentId = $stateParams.documentId.$id;
			}
		};

		$scope.saveAndExit = function() {
			if ($stateParams.documentId || $scope.saveStatus) {
				FirebaseFactory.updateItem(['documents', $stateParams.documentId], {
					title: $scope.document.title,
					body : $scope.document.body
				});
				$state.go('index.documents');
			} else {
				FirebaseFactory.addToCollection('documents', {
					title: $scope.document.title,
					body: $scope.document.body
				});
				$state.go('index.documents');
			}
		};

		$scope.cancel = function(){
			$state.go('index.documents');
		};
	});
})();