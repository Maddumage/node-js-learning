const Auth = require('../database/Auth');

const createNewUser = (newUser) => {
	try {
		const user = Auth.createNewUser(newUser);
		return user;
	} catch (error) {
		throw error;
	}
};

const findUser = (oldUser) => {
	try {
		const user = Auth.findUser(oldUser);
		return user;
	} catch (error) {
		throw error;
	}
};

module.exports = { createNewUser, findUser };
