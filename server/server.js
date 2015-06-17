var express = require('express');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/../client'));

var server = app.listen(port, function () {
	console.log('Example app listening at http://localhost:%s', port);
});

