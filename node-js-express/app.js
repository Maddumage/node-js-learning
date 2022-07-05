var express = require('express');
var bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// use global define body parser
// parse application/json
app.use(bodyParser.json());

// // parse various different custom JSON types as JSON
// app.use(bodyParser.json({ type: 'application/*+json' }))

// // parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// // parse an HTML body into a string
// app.use(bodyParser.text({ type: 'text/html' }))

// basic static get requests
app.get('/', function (req, res) {
	res.send('This is the home page');
});

app.get('/contact', function (req, res) {
	res.send('This is the contact page');
});

// dynamic requests

app.get('/api/profile/:id', function (req, res) {
	const id = req.params.id;

	res.send(
		`You are requested to get information for the profile with the id of ${id}`
	);
});

// read query params

app.get('/api/users', function (req, res) {
	const queryParams = req.query;
	console.log(queryParams);
	res.send(JSON.stringify(queryParams));
});

app.post('/api/users/add', function (req, res) {
	const data = req.body;
	console.log(data);
	if (Object.entries(data).length > 0) {
		res.send({ data: req.body });
	} else {
		res.status(400).send({
			isError: true,
			message: 'Request body is empty!',
		});
	}
});

// define port for the app
app.listen(3000);
