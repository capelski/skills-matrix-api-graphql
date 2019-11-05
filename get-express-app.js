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
			const contextInstance = context(repositories);
			const getGraphQLContext = (user) => ({
				context: {
					...contextInstance,
					user
				},
				graphiql: true,
				schema,
			});
			const employeePermissions = ['employees:read', 'employees:create', 'employees:delete', 'employees:update'];
			const skillPermissions = ['skills:read', 'skills:create', 'skills:delete', 'skills:update'];

			app.use(/\//, graphqlHttp((request, response) => {
				// Bypassing authorization for demo purposes
				return getGraphQLContext({
					id: 'admin',
					permissions: employeePermissions.concat(skillPermissions),
				});	
			}));

			const credentialsMiddleware = (userId, permissionsSets) => (request, response, next) => {
				const user = {
					id: userId,
					permissions: permissionsSets
				};
				const token = jsonwebtoken.sign(user, config.JWT_SECRET, { expiresIn: '3h' });
				return response.json({
					message: 'Authentication successful!',
					token
				});
			};

			// Instead of this endpoint, we would have a single /login endpoint performing real authentication
			app.use('/nobody-token', credentialsMiddleware('nobody', []));
			app.use('/employees-token', credentialsMiddleware('employee', employeePermissions));
			app.use('/skills-token', credentialsMiddleware('skill', skillPermissions));
			app.use('/admin-token', credentialsMiddleware('admin', employeePermissions.concat(skillPermissions)));

			app.use('/auth', graphqlHttp((request, response) => {
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
							permissions: token.permissions,
						}))
						.catch(() => response.status(401).send({errorMessage: 'Invalid authorization token'}));	
				}
			}));

			return app;
		});
};

// TODO Rename services to resolvers
// TODO Typescript
// TODO prettier + lint
// TODO Multiple orderBy is not supported

module.exports = getExpressApp;