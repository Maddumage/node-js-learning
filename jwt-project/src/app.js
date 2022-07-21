require('dotenv').config();
require('./config/database').connect();

const bodyParser = require('body-parser');
const express = require('express');
const compression = require('compression');
const apicache = require('apicache-plus');

// the default config is good enough, but if e.g you want to cache only responses of status 200
const onlyStatus200 = (req, res) => res.statusCode === 200;

const v1AuthRouter = require('./v1/routes/authRoutes');

const { API_PORT } = process.env;

const PORT = API_PORT || 3000;

const app = express();

app.use(apicache('5 minutes', onlyStatus200));
app.use(compression());
app.use(bodyParser.json());
// bind routes
app.use('/api/v1/auth', v1AuthRouter);

// This should be the last route else any after it won't work
app.use('*', (req, res) => {
	res.status(404).send({
		success: 'false',
		message: 'Page not found',
		error: {
			statusCode: 404,
			message: 'You reached a route that is not defined on this server',
		},
	});
});

// server listening
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
