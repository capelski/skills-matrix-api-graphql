import express from 'express';
import graphqlHttp from 'express-graphql';
import jsonwebtoken from 'jsonwebtoken';
import { Client } from 'pg';
import { Configuration, getConfiguration } from './configuration';
import { contextFactory } from './context';
import permissions, { User } from './permissions';
import inMemoryRepositories from './repositories/in-memory';
import postgreRepositories from './repositories/postgre';
import schema from './schema';

const decodeJsonWebToken = (encodedToken: string, secret: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(encodedToken, secret, undefined, (error, decodedToken) => {
            if (error) {
                reject(error);
            } else {
                resolve(decodedToken as User);
            }
        });
    });
};

export const getExpressApp = (environmentConfig: Partial<Configuration> = {}) => {
    const config = getConfiguration(environmentConfig);
    const postgreClient = new Client({
        database: config.DB_NAME,
        host: config.DB_HOST,
        password: config.DB_PASSWORD,
        port: config.DB_PORT,
        user: config.DB_USER
    });

    const repositoriesPromise = config.USE_DATABASE
        ? postgreClient
              .connect()
              .then(() => {
                  console.log('Successfully connected to database');
                  return postgreRepositories(postgreClient);
              })
              .catch(error => {
                  console.error(error);
                  console.log('Using in-memory repositories');
                  return inMemoryRepositories();
              })
        : Promise.resolve(inMemoryRepositories()).then(repositories => {
              console.log('Using in-memory repositories');
              return repositories;
          });

    return repositoriesPromise.then(repositories => {
        const app = express();
        const adminUser: User = {
            id: 'admin',
            permissions: permissions.all
        };
        const getGraphQLContext = (user: User) => ({
            context: contextFactory(repositories, user),
            graphiql: true,
            schema
        });

        app.use(
            /\//,
            // Bypassing authorization for demo purposes
            graphqlHttp(() => getGraphQLContext(adminUser))
        );

        const credentialsMiddleware = (userId: string, permissionsSet: string[]) => (
            request: express.Request,
            response: express.Response,
            next: express.NextFunction
        ) => {
            const user = {
                id: userId,
                permissions: permissionsSet
            };
            const token = jsonwebtoken.sign(user, config.JWT_SECRET, { expiresIn: '3h' });
            return response.json({
                message: 'Authentication successful!',
                token
            });
        };

        // Instead of this endpoint, we would have a single /login endpoint performing real authentication
        app.use('/nobody-token', credentialsMiddleware('nobody', []));
        app.use('/employees-token', credentialsMiddleware('employee', permissions.employees));
        app.use('/skills-token', credentialsMiddleware('skill', permissions.skills));
        app.use('/admin-token', credentialsMiddleware('admin', permissions.all));

        app.use(
            '/auth',
            graphqlHttp((request, response) => {
                // Allow access to graphiql
                if (request.method === 'GET') {
                    return getGraphQLContext(adminUser);
                } else {
                    const authorizationToken = request.headers['authorization'];
                    if (!authorizationToken) {
                        // TODO Remove any cast
                        return (response as any)
                            .status(401)
                            .json({ errorMessage: 'Authorization token required' });
                    }

                    return decodeJsonWebToken(authorizationToken, config.JWT_SECRET)
                        .then(token =>
                            getGraphQLContext({
                                id: token.id,
                                permissions: token.permissions
                            })
                        )
                        .catch(() =>
                            // TODO Remove any cast
                            (response as any)
                                .status(401)
                                .send({ errorMessage: 'Invalid authorization token' })
                        );
                }
            })
        );

        return app;
    });
};

export default getExpressApp;

// TODO The employeeSkill Repo should not retrieve Skills neither Employees. Move that to the service
// TODO tslint
// TODO Multiple orderBy is not supported
