import alasql from 'alasql';
import { expect } from 'chai';
import { Given, When, Then } from 'cucumber';
import { graphql } from 'graphql';
import { Client } from 'pg';
import { contextFactory } from '../../src/context';
import permissions from '../../src/permissions';
import inMemoryRepositories from '../../src/repositories/in-memory';
import postgreRepositories from '../../src/repositories/postgre';
import employees from '../../src/repositories/postgre/alasql/employees.json';
import skills from '../../src/repositories/postgre/alasql/skills.json';
import employees_skills from '../../src/repositories/postgre/alasql/employees-skills.json';
import schema from '../../src/schema';
import { cucumberContext } from './cucumber-context';

// TODO alasql raises exceptions when using UNIQUE, PRIMARY KEY and REFERENCES
const createTables = () =>
    alasql.promise(`
CREATE TABLE IF NOT EXISTS employee (
    id INT NOT NULL, -- UNIQUE PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS skill (
    id INT NOT NULL, -- UNIQUE PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS employee_skill (
    employee_id INT, --PRIMARY KEY REFERENCES employee(id),
    skill_id INT --PRIMARY KEY REFERENCES skill(id)
);`);

const populateTables = () => {
    // TODO Remove any cast
    (alasql as any).tables.employee.data = employees.map((e: any) => ({ ...e }));
    (alasql as any).tables.skill.data = skills.map((e: any) => ({ ...e }));
    (alasql as any).tables.employee_skill.data = employees_skills.map((e_s: any) => ({ ...e_s }));
};

const replaceQueryParameters = (sql: string, parameters: string[]) => {
    // alasql doesn't support parametrized queries. We need to replace the values
    return parameters
        ? parameters.reduce((reduced, next, index) => {
              return reduced.replace(
                  `$${index + 1}`,
                  typeof next === 'string' ? `'${next}'` : next
              );
          }, sql)
        : sql;
};

const fixOrderByCount = (sql: string) => {
    // alasql returns an incorrect data set when ordering by a COUNT() if
    // the COUNT() is not present in the SELECT
    const hasOrderByCount = sql.match(/ORDER BY COUNT\((.*)\)/);
    if (hasOrderByCount) {
        return sql.replace(/SELECT (.*) FROM/, `SELECT $1, COUNT(${hasOrderByCount[1]}) FROM`);
    }
    return sql;
};

const replaceSequencesOperators = (sql: string) => {
    // alasql doesn't support postgreSql nextval and currval
    const nextId = String(98);
    return sql.replace(/nextval\([^\)]*\)/, nextId).replace(/currval\([^\)]*\)/, nextId);
};

Given('the defined GraphQL schema', () => {
    cucumberContext.schema = schema;
});

Given('the in-memory repositories', () => {
    cucumberContext.repositories = inMemoryRepositories();
});

Given('the postgre repositories', () => {
    return createTables()
        .then(populateTables)
        .then(() => {
            const alasqlClient = {
                query: (sql: string, parameters: string[]) => {
                    sql = replaceQueryParameters(sql, parameters);
                    sql = fixOrderByCount(sql);
                    sql = replaceSequencesOperators(sql);

                    return alasql
                        .promise(sql)
                        .then(rows => {
                            // console.log(sql);
                            // console.log(rows);

                            if (rows[0] && rows[0]['COUNT(*)']) {
                                return {
                                    rows: [
                                        {
                                            count: rows[0]['COUNT(*)']
                                        }
                                    ]
                                };
                            }

                            return {
                                rows
                            };
                        })
                        .catch(error => {
                            console.log(sql);
                            console.error(error);
                            throw error;
                        });
                }
            };

            cucumberContext.repositories = postgreRepositories(alasqlClient as Client);
        });
});

Given('a user having {string} permissions', (permissionSet: string) => {
    cucumberContext.user = {
        id: 'user',
        // TODO Improve the solution
        permissions: (permissions as any)[permissionSet]
    };
});

Given('a user without permissions', () => {
    cucumberContext.user = {
        id: 'user',
        permissions: []
    };
});

// TODO Add types to Cucumber parameters
When(/I perform the query$/, async query => {
    cucumberContext.context = contextFactory(cucumberContext.repositories!, cucumberContext.user!);
    cucumberContext.queryResult = await graphql(
        cucumberContext.schema,
        query,
        undefined,
        cucumberContext.context
    );
});

Then('an error is returned', () => {
    expect(cucumberContext.queryResult.errors).to.length(1);
});

Then('the error message contains {string}', errorContent => {
    const error = cucumberContext.queryResult.errors[0];
    expect(error.message).to.contain(errorContent);
});
