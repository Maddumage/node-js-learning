require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const morgan = require('morgan');

const v1AuthRouter = require('./v1/routes/authRoutes');

const { API_PORT } = process.env;

const PORT = API_PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/auth', v1AuthRouter);

// This should be the last route else any after it won't work
app.use('*', (req, res) => {
	res.status(404).json({
		message: 'Page not found',
		isError: true,
		error: 'You reached a route that is not defined on this server',
	});
});

// server listening
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
