require('dotenv').config();
const connectDB = require('./database/connect');
const express = require('express');
const morgan = require('morgan');

const v1AuthRouter = require('./v1/routes/authRoutes');
const v1UserRouter = require('./v1/routes/userRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/auth', v1AuthRouter);
app.use('/api/v1/user', v1UserRouter);

// This should be the last route else any after it won't work
app.use('*', (req, res) => {
	res.status(404).json({
		message: 'Page not found',
		isError: true,
		error: 'You reached a route that is not defined on this server',
	});
});

const start = async () => {
	try {
		await connectDB()
			.then(() => {
				console.log(`Database connected successfully`);
				// server listening
				app.listen(process.env.API_PORT, () => {
					console.log(
						`Server running on port ${process.env.API_PORT}`
					);
				});
			})
			.catch((error) => {
				console.log(error);
				console.log(
					'Failed to connect to the database.'
				);
			});
	} catch (error) {
		console.log(error);
		console.log('Failed to start the application');
	}
};

start();
