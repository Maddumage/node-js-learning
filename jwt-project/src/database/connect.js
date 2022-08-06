const mongoose = require('mongoose');
const config = require('../config/server');

const options = {
	autoIndex: true, // Don't build indexes
	maxPoolSize: 10, // Maintain up to 10 socket connections
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4, // Use IPv4, skip trying IPv6
};

const connectDB = () => {
	return mongoose.connect(config.MONGO_URI, options);
};

module.exports = connectDB;
