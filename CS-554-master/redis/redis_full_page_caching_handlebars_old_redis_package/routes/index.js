const tvmazeRoutes = require('./tvmaze');

const constructorMethod = (app) => {
	app.use('/', tvmazeRoutes);

	app.use('*', (req, res) => {
		res.json({ error: 'Route no valid' });
	});
};

module.exports = constructorMethod;
