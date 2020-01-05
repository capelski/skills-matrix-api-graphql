import alasql from 'alasql';
import { expect } from 'chai';
import { Given, Then, When } from 'cucumber';
import { graphql } from 'graphql';
import { contextFactory } from '../../src/context';
import permissions, { Permissions } from '../../src/permissions';
import inMemoryRepositories from '../../src/repositories/in-memory';
import postgreRepositories from '../../src/repositories/postgre';
import { Repositories, SqlRepositoriesBuilders } from '../../src/repositories/types';
import schema from '../../src/schema';
import employees_skills from '../data/employees-skills.json';
import employees from '../data/employees.json';
import skills from '../data/skills.json';
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
    (alasql as any).tables.employee_skill.data = employees_skills.map((eS: any) => ({ ...eS }));
};

const replaceQueryParameters = (sql: string, parameters: Array<string | number>) => {
    // alasql doesn't support parametrized queries. We need to replace the values
    return parameters
        ? (parameters.reduce((reduced: string, next, index) => {
              return reduced.replace(
                  `$${index + 1}`,
                  typeof next === 'string' ? `'${next}'` : String(next)
              );
          }, sql) as string)
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
    return createTables()
        .then(populateTables)
        .then(() => {
            const sqlQueryResolver = (
                sql: string,
                parameters: Array<string | number>
            ): Promise<any> => {
                sql = replaceQueryParameters(sql, parameters);
                sql = fixOrderByCount(sql);
                sql = replaceSequencesOperators(sql);

                return new Promise((resolve, reject) => {
                    alasql
                        .promise(sql)
                        .then(rows => {
                            // console.log(sql);
                            // console.log(rows);

                            if (rows[0] && rows[0]['COUNT(*)']) {
                                resolve({
                                    rows: [
                                        {
                                            count: rows[0]['COUNT(*)']
                                        }
                                    ]
                                });
                            }

                            resolve({ rows });
                        })
                        .catch(error => {
                            console.log(sql);
                            console.error(error);
                            reject(error);
                        });
                });
            };

            const postgreRepositoriesBuilders: SqlRepositoriesBuilders = postgreRepositories();
            const postgreRepositoriesInstance: Repositories = {
                employees: postgreRepositoriesBuilders.employees(sqlQueryResolver),
                employeesSkills: postgreRepositoriesBuilders.employeesSkills(sqlQueryResolver),
                skills: postgreRepositoriesBuilders.skills(sqlQueryResolver)
            };

            cucumberContext.implementations = [
                {
                    repositories: inMemoryRepositories()
                },
                {
                    repositories: postgreRepositoriesInstance
                }
            ];
        });
});

Given('a user having {string} permissions', (permissionSet: keyof Permissions) => {
    cucumberContext.user = {
        id: 'user',
        permissions: permissions[permissionSet]
    };
});

Given('a user without permissions', () => {
    cucumberContext.user = {
        id: 'user',
        permissions: []
    };
});

When(/I perform the query$/, async (query: string) => {
    cucumberContext.implementations.forEach(async implementation => {
        implementation.context = contextFactory()(
            implementation.repositories,
            cucumberContext.user!
        );
        implementation.queryResult = await graphql(
            cucumberContext.schema!,
            query,
            undefined,
            implementation.context
        );
    });
});

Then('an error is returned', () => {
    cucumberContext.implementations.forEach(implementation => {
        expect(implementation.queryResult.errors).to.length(1);
    });
});

Then('the error message contains {string}', errorContent => {
    cucumberContext.implementations.forEach(implementation => {
        const error = implementation.queryResult.errors[0];
        expect(error.message).to.contain(errorContent);
    });
});
