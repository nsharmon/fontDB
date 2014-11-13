var express = require('express');
var app = express();

var logger = require('./util/logger.js');

app.use(express.static(__dirname + '/public'));

app.use(require('morgan')("combined", { 
	"stream": logger.stream,
}));

app.get('/hello', function (req, res) {
	res.send('Hello World!')
});

var server = app.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port

	console.log('Example app listening at http://%s:%s', host, port);
})