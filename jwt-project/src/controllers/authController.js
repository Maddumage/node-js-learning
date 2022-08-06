const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/model/User');
const UserToken = require('../database/model/UserToken');
const { success, error } = require('../utils/responseHelper');
const tokenHelper = require('../utils/tokenHelper');
const validationSchema = require('../utils/validationSchema');

const {
	signUpBodyValidation,
	logInBodyValidation,
	refreshTokenBodyValidation,
} = validationSchema;

const { verifyRefreshToken, generateTokens } = tokenHelper;

const signUp = async (req, res) => {
	try {
		const { error } = signUpBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json(error(error.details[0].message, 400));

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(400)
				.json(
					error(
						'User with given email already exist',
						400
					)
				);

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();

		res.status(201).json(
			success('Account created sucessfully', null, 201)
		);
	} catch (err) {
		console.log(err);
		res.status(500).json(error('Internal Server Error', 500));
	}
};

const signIn = async (req, res) => {
	try {
		const { error } = logInBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json(error(error.details[0].message, 400));

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(401)
				.json(error('Invalid email or password', 401));

		const verifiedPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!verifiedPassword)
			return res
				.status(401)
				.json(error('Invalid email or password', 401));

		const tokens = await generateTokens(user);

		res.status(200).json(
			success('Logged in sucessfully', tokens, 200)
		);
	} catch (err) {
		console.log(err);
		res.status(500).json(error('Internal Server Error', 500));
	}
};

const refrechToken = async (req, res) => {
	try {
		const validation = refreshTokenBodyValidation(req.body);
		if (validation.error)
			return res
				.status(400)
				.json(
					error(
						validation.error.details[0]
							.message,
						400
					)
				);

		verifyRefreshToken(req.body.refreshToken)
			.then(({ tokenDetails }) => {
				const payload = {
					_id: tokenDetails._id,
					roles: tokenDetails.roles,
				};
				const accessToken = jwt.sign(
					payload,
					process.env.ACCESS_TOKEN_PRIVATE_KEY,
					{ expiresIn: '14m' }
				);
				res.status(200).json(
					success(
						'Access token created successfully',
						accessToken,
						200
					)
				);
			})
			.catch((err) => {
				res.status(400).json(
					error(err?.message ?? err, 400)
				);
			});
	} catch (error) {
		res.status(500).json(error(error?.message ?? error, 500));
	}
};

const logout = async (req, res) => {
	try {
		const { error } = refreshTokenBodyValidation(req.body);
		if (error)
			return res
				.status(400)
				.json(error(error.details[0].message, 400));

		const userToken = await UserToken.findOne({
			token: req.body.refreshToken,
		});
		if (!userToken)
			return res
				.status(400)
				.json(error('Token not found', 400));

		await userToken.remove();
		res.status(200).json(
			success('Logged Out Sucessfully', true, 200)
		);
	} catch (err) {
		console.log(err);
		res.status(500).json(error('Internal Server Error', 500));
	}
};

module.exports = {
	signUp,
	signIn,
	refrechToken,
	logout,
};
