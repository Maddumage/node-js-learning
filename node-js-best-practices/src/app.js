const express = require('express');
const bodyParser = require('body-parser');
const apicache = require('apicache');

// routes
const v1WorkoutRouter = require('./v1/routes/workoutRoutes');
const { swaggerDocs: V1SwaggerDocs } = require('./v1/swagger');

const app = express();
// cache all APIs
const cache = apicache.middleware;
const HOST_NAME = '127.0.0.1';
const PORT = process.env.PORT || 3000;

// To be able to parse the sent JSON inside the request body, we need to install body-parser first and configure it.
app.use(bodyParser.json());
app.use(cache('2 minutes'));
app.use('/api/v1/workouts', v1WorkoutRouter);

// For testing purposes
app.get('/', (req, res) => {
	res.send("<h2>It's Working!</h2>");
});

app.listen(PORT, () => {
	console.log(`API is listening on port ${PORT}`);
	V1SwaggerDocs(app, PORT);
});
