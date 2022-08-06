const User = require('../database/model/User');
const { error, success } = require('../utils/responseHelper');

const getUser = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await User.findById(userId);
		return res.status(200).json(success('success', user, 200));
	} catch (err) {
		console.log(err);
		res.status(500).json(error('Internal Server Error', 500));
	}
};

module.exports = {
	getUser,
};
