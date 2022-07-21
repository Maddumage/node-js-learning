const authService = require('../services/authService');
const config = require('../config/server');

const createNewUser = async (req, res) => {
	try {
		// Get user input
		const { first_name, last_name, email, password } = req.body;
		// Validate user input
		if (!(email && password && first_name && last_name)) {
			return res.status(400).send({
				isError: true,
				error: 'All input is required',
			});
		}

		// Create user in our database
		const user = await authService.createNewUser(req.body);
		// return new user
		res.status(201).send(user);
	} catch (error) {
		res.status(error?.status || 500).send({
			isError: true,
			data: {
				error: error?.message || error,
			},
		});
	}
};

const findUser = async (req, res) => {
	try {
		// Get user input
		const { email, password } = req.body;
		// Validate user input
		if (!(email && password)) {
			return res.status(400).send({
				isError: true,
				error: 'All input is required',
			});
		}

		// Create user in our database
		const user = await authService.findUser(req.body);
		// return new user
		res.status(200).send(user);
	} catch (error) {
		console.error(error);
		res.status(error?.status || 500).send({
			isError: true,
			data: {
				error: error?.message || error,
			},
		});
	}
};

const refreshToken = async (req, res) => {
	try {
		// console.log(res);
		const token =
			req.body.token ||
			req.query.token ||
			req.headers['authorization'];

		if (!token) {
			return res.status(400).send({
				isError: true,
				error: 'Token is required',
			});
		}

		// Create user in our database
		const newToken = authService.refreshToken(token);
		// Set the new token as the users `token` cookie
		res.cookie('token', newToken, {
			maxAge: config.TOKEN_EXPIRATIONS * 1000,
		});
		// return new user
		res.status(200).send(newToken);
	} catch (error) {
		console.error(error);
		res.status(error?.status || 500).send({
			isError: true,
			data: {
				error: error?.message || error,
			},
		});
	}
};

module.exports = {
	createNewUser,
	findUser,
	refreshToken,
};
