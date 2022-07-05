var fs = require('fs');
var http = require('http');

var server = http.createServer(function (req, res) {
	console.log('Request made : ' + req.url);
	res.writeHead(200, {
		'Content-Type': 'text/plain',
	});
	// if you want to serve html content to the client just change the content type to text/html and add related html file to read stream
	var readStream = fs.createReadStream(__dirname + '/readMe.txt', 'utf8');
	readStream.pipe(res);
});

server.listen(3000, '127.0.0.1');

console.log('You are listening to the port 3000 now');
