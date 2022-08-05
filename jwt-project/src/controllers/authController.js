const authService = require('../services/authService');

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
		res.status(201).json(user);
	} catch (error) {
		res.status(error?.status || 500).json({
			isError: true,
			error: error?.message || error,
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
				error: 'Please provide valid user name and password',
			});
		}

		// Find user in our database
		const user = await authService.findUser(req.body);
		// return the user
		res.status(200).json(user);
	} catch (error) {
		res.status(error?.status || 500).json({
			isError: true,
			error: error?.message || error,
		});
	}
};

module.exports = {
	createNewUser,
	findUser,
};
