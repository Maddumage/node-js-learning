const express = require('express');
const mongoose = require('mongoose');

const app = express();

// mongo db connection string
const dbConnection =
	'mongodb+srv://admin:kO0O808YFwsW6QuC@cluster0.zdyft.mongodb.net/?retryWrites=true&w=majority';

// connect to mongo db
mongoose.connect(dbConnection)
	.then((result) => {
		// connected to the db
		console.log('Mongo db Connected!');
		// listen to port
		app.listen(3000);
		console.log('You are listening to port 3000');
	})
	.catch((error) => {
		console.log(error);
	});
