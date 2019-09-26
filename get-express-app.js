const express = require('express');
const graphqlHttp = require('express-graphql');
// const getConfiguration = require('./configuration');

const getExpressApp = (environmentConfig) => {
	// TODO: Eventually use the config to connect to a database
	// const config = getConfiguration(environmentConfig);

	return new Promise((resolve, reject) => {
		const app = express();
		app.use('/graphql', graphqlHttp({
			context: {
				services: instantiateInMemoryServices()
			},
			graphiql: true,
			schema: TODO
		}));
		resolve(app);
	});
};

const instantiateInMemoryServices = () => {
	return {
		employees: require('./in-memory/services/employees-service'),
		skills: require('./in-memory/services/skills-service')
	};
};
module.exports = getExpressApp;