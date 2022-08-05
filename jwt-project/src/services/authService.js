const Auth = require('../database/Auth');

const createNewUser = async (newUser) => {
	try {
		const user = await Auth.createNewUser(newUser);
		return user;
	} catch (error) {
		throw error;
	}
};

const findUser = async (oldUser) => {
	try {
		const user = await Auth.findUser(oldUser);
		return user;
	} catch (error) {
		throw error;
	}
};

const refreshToken = (oldToken) => {
	try {
		const user = Auth.refresh(oldToken);
		return user;
	} catch (error) {
		throw error;
	}
};

module.exports = { createNewUser, findUser, refreshToken };
