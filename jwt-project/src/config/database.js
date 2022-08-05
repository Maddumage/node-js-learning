const mongoose = require('mongoose');

const config = require('./server');

const options = {
	autoIndex: true, // Don't build indexes
	maxPoolSize: 10, // Maintain up to 10 socket connections
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4, // Use IPv4, skip trying IPv6
};

exports.connect = () => {
	try {
		// Connecting to the database
		mongoose.connect(config.MONGO_URI, options)
			.then(() => {
				console.log(
					'Successfully connected to database'
				);
			})
			.catch((error) => {
				console.log(
					'database connection failed. exiting now...'
				);
				console.error(error);
				process.exit(1);
			});
	} catch (error) {
		console.log(error);
	}
};
