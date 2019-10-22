const express = require('express');
const graphqlHttp = require('express-graphql');
// const getConfiguration = require('./configuration');
const schema = require('./schema');

const repositories = require('./repositories/in-memory')();
const context = require('./context')(repositories);

const getExpressApp = (environmentConfig) => {
	// TODO: Eventually use the config to connect to a database
	// TODO: If database connection fails, use in-memory repositories
	// const config = getConfiguration(environmentConfig);

	return new Promise((resolve, reject) => {
		const app = express();
		app.use('/graphql', graphqlHttp({
			context,
			graphiql: true,
			schema
		}));
		resolve(app);
	});
};

// TODO Mutations
// TODO repository operations should return copies of the objects to reflect the database nature
// TODO Typescript
// TODO prettier + lint
// TODO Cucumber tests for nested collections

module.exports = getExpressApp;