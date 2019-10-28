const express = require('express');
const graphqlHttp = require('express-graphql');
const { Client } = require('pg');
const getConfiguration = require('./configuration');
const schema = require('./schema');

const inMemoryRepositories = require('./repositories/in-memory');
const postgreRepositories = require('./repositories/postgre');
const context = require('./context');

const getExpressApp = (environmentConfig) => {
	const config = getConfiguration(environmentConfig);
	const postgreClient = new Client({
		database: config.DB_NAME,
		host: config.DB_HOST,
		password: config.DB_PASSWORD,
		port: config.DB_PORT,
		user: config.DB_USER
	});

	return postgreClient.connect()
		.then(() => {
			console.log('Successfully connected to database');
			return postgreRepositories(postgreClient);
		})
		.catch(error => {
			console.error(error);
			console.log('Using in-memory repositories');
			return inMemoryRepositories();
		})
		.then(repositories => {
			const app = express();
			app.use('/graphql', graphqlHttp({
				context: context(repositories),
				graphiql: true,
				schema
			}));
			return app;
		});
};

// TODO Test with AlaSQL
// TODO Auth and permissions
// TODO Multiple orderBy is not supported
// TODO Typescript
// TODO prettier + lint

module.exports = getExpressApp;