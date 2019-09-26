const express = require('express');
const graphqlHttp = require('express-graphql');
// const getConfiguration = require('./configuration');
const schema = require('./schema');
const employeesRepository = require('./repositories/in-memory/employees-repository');
const skillsRepository = require('./repositories/in-memory/skills-repository');
const employeesService = require('./services/employees-service')(employeesRepository);
const skillsService = require('./services/skills-service')(skillsRepository);

const getExpressApp = (environmentConfig) => {
	// TODO: Eventually use the config to connect to a database
	// TODO: If database connection fails, use in-memory repositories
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