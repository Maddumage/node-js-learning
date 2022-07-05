var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var data = [
	{ item: 'Make dinner' },
	{ item: 'Walk dog' },
	{ item: 'Go to the shop' },
];

module.exports = function (app) {
	// todo controller

	app.get('/todo', function (req, res) {
		// get todos
		res.render('todo', { todos: data });
	});

	app.post('/todo', urlencodedParser, function (req, res) {
		// add new todo item
		data.push(req.body);
		res.json(data);
	});

	app.delete('/todo', function (req, res) {
		// delete todo item
	});
};
