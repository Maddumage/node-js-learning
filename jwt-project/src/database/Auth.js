const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./model/user');
const config = require('../config/server');

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
		//Encrypt user password
		const encryptedPassword = await bcrypt.hash(password, 10);
		// Create user in our database
		const user = await User.create({
			...newUser,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			password: encryptedPassword,
		});

		// Create a new token with the username in the payload
		// and which expires 300 seconds after issue
		const token = jwt.sign(
			{ id: user._id, email },
			config.JWT_KEY,
			{
				algorithm: 'HS256',
				expiresIn: config.TOKEN_EXPIRATIONS,
			}
		);
		console.log('token:', token);

		// set the cookie as the token string, with a similar max age as the token
		// here, the max age is in milliseconds, so we multiply by 1000
		res.cookie('token', token, {
			maxAge: config.TOKEN_EXPIRATIONS * 1000,
		});
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
		if (user && bcrypt.compare(password, user.password)) {
			// Create a new token with the username in the payload
			// and which expires 300 seconds after issue
			const token = jwt.sign(
				{ id: user._id, email },
				config.JWT_KEY,
				{
					algorithm: 'HS256',
					expiresIn: config.TOKEN_EXPIRATIONS,
				}
			);
			console.log('token:', token);

			// save user token
			user.token = token;
			// user
			return user;
		} else {
			throw {
				status: 400,
				message: 'Invalid Credentials',
			};
		}
	} catch (error) {
		throw {
			status: error?.status || 500,
			message: error?.message || error,
		};
	}
};

const refresh = (token) => {
	var payload;
	try {
		payload = jwt.verify(token, config.JWT_KEY);
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			throw {
				status: 401,
				message: (e?.message || e) ?? 'Token error',
			};
		}
		throw {
			status: 400,
			message: e?.message || e,
		};
	}
	// (END) The code uptil this point is the same as the first part of the `welcome` route

	// We ensure that a new token is not issued until enough time has elapsed
	// In this case, a new token will only be issued if the old token is within
	// 30 seconds of expiry. Otherwise, return a bad request status
	const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
	if (payload.exp - nowUnixSeconds > 30) {
		throw {
			status: 400,
			message: 'Token Expired',
		};
	}

	// Now, create a new token for the current user, with a renewed expiration time
	const newToken = jwt.sign(
		{ username: payload.username },
		config.JWT_KEY,
		{
			algorithm: 'HS256',
			expiresIn: config.TOKEN_EXPIRATIONS,
		}
	);

	return newToken;
};

module.exports = {
	createNewUser,
	findUser,
	refresh,
};
