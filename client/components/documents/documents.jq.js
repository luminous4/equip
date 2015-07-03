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
			// Our Assembly instructions just contain two Steps for now.
			// You can name the Steps how you like.
			steps: {
				// The first Step resizes the uploaded image(s) to 125x125 pixels.
				// The /image/resize robots ignores any files that are not images
				// automatically.
				resize_to_125: {
					robot: "/image/resize",
					use: ":original",
					width: 125,
					height: 125
				},
				// The second Step resizes the results further to 75x75 pixels.
				// Notice how we "use" the output files of the "resize_to_125"
				// step as our input here. We could use all kinds of Steps with
				// various robots that "use" each other, making this perfect for
				// any workflow.
				resize_to_75: {
					robot: "/image/resize",
					use: "resize_to_125",
					width: 75,
					height: 75,
					// We also add a sepia effect here just for fun.
					// The /image/resize robot has a ton of available parameters.
					sepia: 80
				}
			}
		}
	});
});