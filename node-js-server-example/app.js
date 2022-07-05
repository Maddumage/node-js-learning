var http = require('http');
var fs = require('fs');

// create http server
var server = http.createServer(function (req, res) {
	console.log('Request made : ' + req.url);

	if (req.url === '/' || req.url === '/home') {
		// define the request headers
		res.writeHead(200, {
			'Content-Type': 'text/html',
		});
		fs.createReadStream(__dirname + '/index.html').pipe(res);
	} else if (req.url === '/api/users') {
		// define the request headers
		res.writeHead(200, {
			'Content-Type': 'application/json',
		});
		// define the response and attach data
		const users = [
			{
				id: 12345,
				name: 'Roshan Maddumage',
				age: 29,
				address: 'Panawenna, Kahawatta',
			},
			{
				id: 78698,
				name: 'Lahiru Perera',
				age: 37,
				address: 'Kuruwita, Ratnapura',
			},
		];
		// serialize the data before attach to the response
		res.end(JSON.stringify(users));
	} else {
		// define the request headers
		res.writeHead(404, {
			'Content-Type': 'text/html',
		});
		fs.createReadStream(__dirname + '/404.html').pipe(res);
	}
});

// define the port for the server to listen
server.listen(3000, '127.0.0.1');

console.log('You are listening to the port 3000 now');
