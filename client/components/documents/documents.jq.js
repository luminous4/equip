$(function() {
	// We reference our HTML form here
	$('#upload-form').transloadit({
		// We want to wait for all encodings to finish before the form
		// is submitted.
		wait: true,
		// The upload to Transloadit should start as soon as the user
		// selects some files.
		triggerUploadOnFileSelection: true,

		params: {
			auth: {
				// This is your API key.
				key: "INSERT-KEY-HERE"
			},
			template_id: '275df800240e11e5a20c2dc0bd276748'
		},
		onSuccess: function(assembly) {
			console.log(assembly);

			var thisTeam = localStorage['$selectedteam'];
			var thisUser = localStorage['firebase:session::mksequip'].uid;

			var refUrl = 'https://mksequip.firebaseIO.com/';
			console.log('selected team', window.selectedTeam);
			console.log(refUrl);
			var fb = new Firebase(refUrl);
			console.log(window.selectedTeam);
			console.log(assembly.assembly_id);
			fb = fb.child('teams').child(window.selectedTeam).child('images').child(assembly.assembly_id);
			fb.set(assembly.results);
			window.location.href('/#/index.documents');
		}
	});
});