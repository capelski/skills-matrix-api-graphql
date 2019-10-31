const express = require('express');
const graphqlHttp = require('express-graphql');
const jsonwebtoken = require('jsonwebtoken');
const { Client } = require('pg');
const getConfiguration = require('./configuration');
const schema = require('./schema');

const inMemoryRepositories = require('./repositories/in-memory');
const postgreRepositories = require('./repositories/postgre');
const context = require('./context');

const decodeJsonWebToken = (encodedToken, secret, options) => {
	return new Promise((resolve, reject) => {
		jsonwebtoken.verify(encodedToken, secret, options, (error, decodedToken) => {
			if (error) {
				reject(error);
			} else {
				resolve(decodedToken);
			}
		});
	});
};

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
			const getGraphQLContext = (user) => ({
				context: context(repositories),
				graphiql: true,
				schema,
				user
			});

			app.use('/let-me-in', (request, response, next) => {
				// Here we would implement proper user authentication
				// Instead, we create a token for a hard coded user
				const user = {
					id: 'admin'
					// TODO Add permissions
				};
				const token = jsonwebtoken.sign(user, config.JWT_SECRET, { expiresIn: '3h' });
				response.json({
					message: 'Authentication successful!',
					token
				});
			});

			app.use('/graphql', graphqlHttp((request, response) => {
				// Allow access to graphiql
				if (request.method === 'GET') {
					return getGraphQLContext();
				}
				else {
					const authorizationToken = request.headers['authorization'];
					if (!authorizationToken) {
						return response.status(401).json({errorMessage: 'Authorization token required'});
					}
	
					return decodeJsonWebToken(authorizationToken, config.JWT_SECRET)
						.then(token => getGraphQLContext({
							id: token.id,
						}))
						.catch(() => response.status(401).send({errorMessage: 'Invalid authorization token'}));	
				}
			}));
			return app;
		});
};

// TODO Typescript
// TODO prettier + lint
// TODO Multiple orderBy is not supported

module.exports = getExpressApp;