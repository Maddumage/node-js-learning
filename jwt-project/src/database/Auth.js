const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./model/user');

const createNewUser = async (newUser) => {
	try {
		const { email, password } = newUser;
		// check if user already exist
		// Validate if user exist in our database
		const oldUser = await User.findOne({ email });
		if (oldUser) {
			throw {
				status: 400,
				message: `User with the email address ${email} already exists`,
			};
		}
		// generate salt to hash password
		const salt = await bcrypt.genSalt(10);
		//Encrypt user password
		const encryptedPassword = await bcrypt.hash(password, salt);
		// Create user in our database
		const user = await User.create({
			...newUser,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			password: encryptedPassword,
		});
		// Create token
		const token = jwt.sign(
			{ user_id: user._id, email },
			process.env.TOKEN_KEY,
			{
				expiresIn: '2h',
			}
		);
		// save user token
		user.token = token;
		return user;
	} catch (error) {
		throw {
			status: error?.status || 500,
			message: error?.message || error,
		};
	}
};

const findUser = async (oldUser) => {
	try {
		const { email, password } = oldUser;
		// Validate if user exist in our database
		const user = await User.findOne({ email });
		if (user) {
			const isValidPassword = await bcrypt.compare(
				password,
				user.password
			);
			if (isValidPassword) {
				// Create token
				const token = jwt.sign(
					{ user_id: user._id, email },
					process.env.TOKEN_KEY,
					{
						expiresIn: '2h',
					}
				);

				// save user token
				user.token = token;
				// user
				return user;
			} else {
				throw {
					status: 400,
					message: 'Invalid password',
				};
			}
		} else {
			throw {
				status: 401,
				message: `Cannot find the user with email ${email}`,
			};
		}
	} catch (error) {
		throw {
			status: error?.status || 500,
			message: error?.message || error,
		};
	}
};

module.exports = {
	createNewUser,
	findUser,
};
