function TextEditorCtrl($scope, $firebaseObject, User, FirebaseFactory){

  console.log('token available in TextEditorCtrl:', User.isAuth());

	$scope.document = {};

	var ref = new Firebase('https://mksequip.firebaseio.com/documents');
	/*
	* fb creates an instance of $firebase which we'll use to save to Firebase
	* */
	//var syncObject = $firebaseObject(ref);
	//syncObject.$bindTo($scope, 'document');

	/*
	* Read the document title and body entered by the user using $scope.
	* */
	var title = $scope.document.title;
	var body = $scope.document.body;

	/*
	* saveDocument saves the text to Firebase
	* */
	$scope.saveDocument = function(){
		console.log('save clicked!');
		//ref.push({
		//	title: $scope.document.title,
		//	body: $scope.document.body
		//});
		FirebaseFactory.addToCollection('documents', {
				title: $scope.document.title,
				body: $scope.document.body
		});
	};
}

angular.module('equip')
			 .controller('TextEditorCtrl', TextEditorCtrl);