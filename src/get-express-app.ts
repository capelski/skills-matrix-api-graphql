import express from 'express';
import graphqlHttp from 'express-graphql';
import jsonwebtoken from 'jsonwebtoken';
import { Client } from 'pg';
import { Configuration, getConfiguration } from './configuration';
import { contextFactory } from './context';
import sqlQueriesResolver from './context/sql-queries-resolver';
import permissions, { User } from './permissions';
import inMemoryRepositories from './repositories/in-memory';
import postgreRepositories from './repositories/postgre';
import { Repositories, RepositoriesSet } from './repositories/types';
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

const getRepositories = (config: Configuration) => {
    const postgreClient = new Client({
        database: config.DB_NAME,
        host: config.DB_HOST,
        password: config.DB_PASSWORD,
        port: config.DB_PORT,
        user: config.DB_USER
    });

    return config.USE_DATABASE
        ? postgreClient
              .connect()
              .then(
                  (): RepositoriesSet => {
                      console.log('Successfully connected to database');

                      return {
                          client: postgreClient,
                          set: postgreRepositories(),
                          type: 'non-built'
                      };
                  }
              )
              .catch(
                  (error): RepositoriesSet => {
                      console.error(error);
                      console.log('Using in-memory repositories');
                      return {
                          set: inMemoryRepositories(),
                          type: 'built'
                      };
                  }
              )
        : Promise.resolve(inMemoryRepositories()).then(
              (repositories): RepositoriesSet => {
                  console.log('Using in-memory repositories');
                  return {
                      set: repositories,
                      type: 'built'
                  };
              }
          );
};

const getRequestGraphQLContext = (repositoriesSet: RepositoriesSet, user: User) => {
    let actualRepositories: Repositories;
    const sqlQueries = sqlQueriesResolver();

    if (repositoriesSet.type === 'non-built') {
        const sqlQuery = (sql: string, parameters: Array<string | number>) => {
            const actualSql = parameters
                ? (parameters.reduce((reduced: string, next, index) => {
                      return reduced.replace(
                          `$${index + 1}`,
                          typeof next === 'string' ? `'${next}'` : String(next)
                      );
                  }, sql) as string)
                : sql;
            const jobFinishedCallback = sqlQueries.add(actualSql);
            return repositoriesSet.client.query(sql, parameters).then(result => {
                jobFinishedCallback();
                return result;
            });
        };

        const parsedRepositories = repositoriesSet.set;
        actualRepositories = {
            employees: parsedRepositories.employees(sqlQuery),
            employeesSkills: parsedRepositories.employeesSkills(sqlQuery),
            skills: parsedRepositories.skills(sqlQuery)
        };
    } else {
        actualRepositories = repositoriesSet.set;
    }

    return {
        context: {
            ...contextFactory(actualRepositories, user),
            sqlQueries
        },
        graphiql: true,
        schema
    };
};

export const getExpressApp = (environmentConfig: Partial<Configuration> = {}) => {
    const config = getConfiguration(environmentConfig);
    const adminUser: User = {
        id: 'admin',
        permissions: permissions.all
    };

    const credentialsGeneratorMiddleware = (userId: string, permissionsSet: string[]) => (
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

    return getRepositories(config).then(repositoriesSet => {
        const app = express();

        app.use(
            /\//,
            // Bypassing authorization for demo purposes
            graphqlHttp(() => getRequestGraphQLContext(repositoriesSet, adminUser))
        );

        // Instead of this endpoint, we would have a single /login endpoint performing real authentication
        app.use('/nobody-token', credentialsGeneratorMiddleware('nobody', []));
        app.use(
            '/employees-token',
            credentialsGeneratorMiddleware('employee', permissions.employees)
        );
        app.use('/skills-token', credentialsGeneratorMiddleware('skill', permissions.skills));
        app.use('/admin-token', credentialsGeneratorMiddleware('admin', permissions.all));

        app.use(
            '/auth',
            graphqlHttp((request, response) => {
                // Allow access to graphiql
                if (request.method === 'GET') {
                    return getRequestGraphQLContext(repositoriesSet, adminUser);
                } else {
                    const authorizationToken = request.headers.authorization;
                    if (!authorizationToken) {
                        // TODO Remove any cast
                        return (response as any)
                            .status(401)
                            .json({ errorMessage: 'Authorization token required' });
                    }

                    return decodeJsonWebToken(authorizationToken, config.JWT_SECRET)
                        .then(token =>
                            getRequestGraphQLContext(repositoriesSet, {
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

// TODO Add dataloaders in a separate branch
// TODO Multiple orderBy is not supported
