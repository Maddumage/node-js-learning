require('dotenv').config();
require('./config/database').connect();
const express = require('express');

const v1AuthRouter = require('./v1/routes/authRoutes');

const { API_PORT } = process.env;

const app = express();

app.use(express.json());
app.use('/api/v1/auth', v1AuthRouter);

// This should be the last route else any after it won't work
app.use('*', (req, res) => {
	res.status(404).json({
		success: 'false',
		message: 'Page not found',
		error: {
			statusCode: 404,
			message: 'You reached a route that is not defined on this server',
		},
	});
});

// server listening
app.listen(API_PORT, () => {
	console.log(`Server running on port ${API_PORT}`);
});
