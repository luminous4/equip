/* casper browser tests */
casper.test.begin('App is setup correctly', 1, function suite(test) {
	casper.start('http://localhost:3000/', function(){
		test.assertExists('.middle-box', "Login form should exist");
	});

	casper.run(function() {
		test.done();
	});
});