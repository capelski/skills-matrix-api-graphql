const alasql = require('alasql');
const { Given, When } = require('cucumber');
const { graphql } = require('graphql');
const permissions = require('../../permissions');
const contextFactory = require('../../context');
const inMemoryRepositories = require('../../repositories/in-memory');
const postgreRepositories = require('../../repositories/postgre');
const schema = require('../../schema');
const shared = require('./shared');

const employees = require('../../repositories/postgre/alasql/employees.json');
const skills = require('../../repositories/postgre/alasql/skills.json');
const employees_skills = require('../../repositories/postgre/alasql/employees-skills.json');

// TODO alasql raises exceptions when using UNIQUE, PRIMARY KEY and REFERENCES
const createTables = () => alasql.promise(`
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
    alasql.tables.employee.data = employees.map(e => ({...e}));
    alasql.tables.skill.data = skills.map(e => ({...e}));
    alasql.tables.employee_skill.data = employees_skills.map(e_s => ({...e_s}));
};

const replaceQueryParameters = (sql, parameters) => {
    // alasql doesn't support parametrized queries. We need to replace the values
    return parameters ? parameters.reduce((reduced, next, index) => {
        return reduced.replace(`$${index + 1}`, typeof next === 'string' ? `'${next}'` : next);
    }, sql) : sql;
};

const fixOrderByCount = (sql) => {
    // alasql returns an incorrect data set when ordering by a COUNT() if
    // the COUNT() is not present in the SELECT
    const hasOrderByCount = sql.match(/ORDER BY COUNT\((.*)\)/);
    if (hasOrderByCount) {
        return sql.replace(/SELECT (.*) FROM/, `SELECT $1, COUNT(${hasOrderByCount[1]}) FROM`);
    }
    return sql;
}

const replaceSequencesOperators = (sql) => {
    // alasql doesn't support postgreSql nextval and currval
    const nextId = 98;
    return sql.replace(/nextval\([^\)]*\)/, nextId).replace(/currval\([^\)]*\)/, nextId);
};

Given('the defined GraphQL schema', () => {
    shared.schema = schema;
});

Given('the in-memory repositories', () => {
    shared.repositories = inMemoryRepositories();
});

Given('the postgre repositories', () => {
    return createTables()
        .then(populateTables)
        .then(() => {
            const alasqlClient = {
                query: (sql, parameters) => {
                    sql = replaceQueryParameters(sql, parameters);
                    sql = fixOrderByCount(sql);
                    sql = replaceSequencesOperators(sql);

                    return alasql.promise(sql)
                        .then(rows => {
                            // console.log(sql);
                            // console.log(rows);
                        
                            if (rows[0] && rows[0]['COUNT(*)']) {
                                return {
                                    rows: [{
                                        count: rows[0]['COUNT(*)']
                                    }]
                                };
                            }
                        
                            return {
                                rows
                            };
                        })
                        .catch((error) => {
                            console.log(sql);
                            console.error(error);
                            throw error;
                        });
                }
            };

            shared.repositories = postgreRepositories(alasqlClient);
        });
});

Given('a user having {string} permissions', (permissionSet) => {
    shared.user = {
        id: 'user',
        permissions: permissions[permissionSet],
    };
});

When(/I perform the query$/, async (query) => {
    shared.context = contextFactory(shared.repositories, shared.user);
    shared.queryResult = await graphql(shared.schema, query, undefined, shared.context);
});
