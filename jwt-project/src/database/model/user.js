const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
// 	first_name: { type: String, default: null },
// 	last_name: { type: String, default: null },
// 	email: { type: String, unique: true, required: true },
// 	password: { type: String, minlength: 6, required: true },
// 	token: { type: String, unique: true },
// });

// module.exports = mongoose.model('user', userSchema);

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	roles: {
		type: [String],
		enum: ['user', 'admin', 'super_admin'],
		default: ['user'],
	},
});

module.exports = mongoose.model('User', userSchema);

// export default User;
