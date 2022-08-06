const jwt = require('jsonwebtoken');
const UserToken = require('../database/model/UserToken');
const responseHelper = require('./responseHelper');

const { success, error } = responseHelper;

const generateTokens = async (user) => {
	try {
		const payload = { _id: user._id, roles: user.roles };
		const accessToken = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_PRIVATE_KEY,
			{ expiresIn: '1h' }
		);
		const refreshToken = jwt.sign(
			payload,
			process.env.REFRESH_TOKEN_PRIVATE_KEY,
			{ expiresIn: '30d' }
		);

		const userToken = await UserToken.findOne({ userId: user._id });
		if (userToken) await userToken.remove();

		await new UserToken({
			userId: user._id,
			token: refreshToken,
		}).save();
		return Promise.resolve({ accessToken, refreshToken });
	} catch (err) {
		return Promise.reject(err);
	}
};

const verifyRefreshToken = (refreshToken) => {
	const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

	return new Promise((resolve, reject) => {
		UserToken.findOne({ token: refreshToken }, (err, doc) => {
			if (!doc)
				return reject({
					error: true,
					message: 'Invalid refresh token',
				});

			jwt.verify(
				refreshToken,
				privateKey,
				(err, tokenDetails) => {
					if (err)
						return reject({
							error: true,
							message: 'Invalid refresh token',
						});
					resolve({
						tokenDetails,
						error: false,
						message: 'Valid refresh token',
					});
				}
			);
		});
	});
};

const verifyToken = (req, res, next) => {
	const authorizationHeader = req.header('Authorization');
	// Split the authorization header value
	const splitAuthorizationHeader = authorizationHeader.split(' ');

	// Get the type of token and actual token
	const bearer = splitAuthorizationHeader[0];
	const token = splitAuthorizationHeader[1];

	// Check the type
	if (bearer !== 'Bearer')
		return res
			.status(400)
			.json(
				error(
					'The type is must be a Bearer',
					res.statusCode
				)
			);

	// Check the token
	if (!token) return res.status(404).json(error('No token found'));

	try {
		const jwtData = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_PRIVATE_KEY
		);

		// Check the JWT token
		if (!jwtData)
			return res
				.status(401)
				.json(error('Unauthorized', res.statusCode));

		// If is a valid token that JWT verify
		// Insert the data to the request
		req.userId = jwtData._id;

		// Continue the action
		next();
	} catch (err) {
		console.error(err.message);
		res.status(401).json(error('Unauthorized', res.statusCode));
	}
};

module.exports = { generateTokens, verifyRefreshToken, verifyToken };
