const express = require('express');
const graphqlHttp = require('express-graphql');
// const getConfiguration = require('./configuration');
const schema = require('./schema');
// TODO Inject the repositories to the services
const employeesService = require('./services/employees-service');
const skillsService = require('./services/skills-service');

const getExpressApp = (environmentConfig) => {
	// TODO: Eventually use the config to connect to a database
	// const config = getConfiguration(environmentConfig);

	return new Promise((resolve, reject) => {
		const app = express();
		app.use('/graphql', graphqlHttp({
			context: {
				services: {
					employees: employeesService,
					skills: skillsService
				}
			},
			graphiql: true,
			schema
		}));
		resolve(app);
	});
};

// TODO: Typescript
// TODO: prettier + lint
// TODO: Cucumber tests

module.exports = getExpressApp;