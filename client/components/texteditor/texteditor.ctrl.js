function TextEditorCtrl($scope, $firebaseObject, User, FirebaseFactory, $stateParams, $firebaseArray, $state){
	var ref = new Firebase('https://mksequip.firebaseio.com/documents');
	var Firedoc = $firebaseArray(ref);

	if($stateParams.documentId) {
		var get = Firedoc.$getRecord($stateParams.documentId);
		console.log('get', get);
	}
	/*Start State Params*/
	$scope.documentId = $stateParams.documentId;
	$scope.documentTitle = $stateParams.documentTitle;
	$scope.documentBody = $stateParams.documentBody;
	/*End State Params*/
	console.log('document: ', $scope.document);

  console.log('token available in TextEditorCtrl:', User.isAuth());

	$scope.document = {title: $scope.documentTitle, body: $scope.documentBody};
	/*
	* fb creates an instance of $firebase which we'll use to save to Firebase
	* */
	//var syncObject = $firebaseObject(ref);
	//syncObject.$bindTo($scope, 'document');

	/*
	* Read the document title and body entered by the user using $scope.
	* */
	var title = $stateParams.documentId;
	var body = $scope.document.body;

	/*
	* saveDocument saves the text to Firebase
	* */
	$scope.saveDocument = function(){
		console.log('save clicked!');
		$scope.saveStatus = true;
		//ref.push({
		//	title: $scope.document.title,
		//	body: $scope.document.body
		//});
		if($stateParams.documentId) {
			console.log('update');
			FirebaseFactory.updateItem(['documents', $stateParams.documentId], {
				title: $scope.document.title,
				body : $scope.document.body
			});
		} else {
			console.log('save and continue, StateParams docId does not exist');
			$stateParams.documentId = FirebaseFactory.addToCollection('documents', {
					title: $scope.document.title,
					body: $scope.document.body
			});
			$stateParams.documentId = $stateParams.documentId.$id;
		}
	};


	/*
	 * saveDocument saves the text to Firebase
	 * */
	$scope.saveAndExit = function(){
		//ref.push({
		//	title: $scope.document.title,
		//	body: $scope.document.body
		//});

		if($stateParams.documentId || $scope.saveStatus) {
			FirebaseFactory.updateItem(['documents', $stateParams.documentId], {
				title: $scope.document.title,
				body : $scope.document.body
			});
			$state.go('index.documents');
		} else {
			FirebaseFactory.addToCollection('documents', {
				title: $scope.document.title,
				body: $scope.document.body
			}).$loaded().then(console.log('this loaded'));
			$state.go('index.documents');
		}
	};

	/*
	* Cancel function
	* */
	$scope.cancel = function(){
		$state.go('index.documents');
	}
}

angular.module('equip')
			 .controller('TextEditorCtrl', TextEditorCtrl);